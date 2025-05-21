
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, LockKeyhole } from 'lucide-react';
import { SocialAuthButtons } from './SocialAuthButtons';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { signIn, resetPassword, isAdmin } = useAuth();
  const { translate, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    // Check for multiple failed login attempts
    if (loginAttempts >= 5) {
      setError("Te veel inlogpogingen. Probeer later opnieuw of reset uw wachtwoord.");
      setSubmitting(false);
      return;
    }
    
    // Clean up auth state first to prevent conflicts
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setLoginAttempts(prev => prev + 1);
      setError(error.message);
      console.log("Login failed:", error.message);
      
      // After 3 failed attempts, suggest password reset
      if (loginAttempts >= 2) {
        setError(`${error.message} U kunt overwegen uw wachtwoord te resetten.`);
      }
    } else {
      // Reset login attempts on successful login
      setLoginAttempts(0);
      toast({
        title: language === 'nl' ? "Ingelogd" : "Logged In",
        description: language === 'nl' ? "U bent succesvol ingelogd." : "You have successfully logged in.",
      });
      
      console.log("Login successful, redirecting to dashboard");
      
      // Force a refresh of the page to ensure clean state
      window.location.href = '/dashboard';
    }
    
    setSubmitting(false);
  };

  const handlePasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Voer uw e-mailadres in om uw wachtwoord te resetten");
      return;
    }
    
    setSubmitting(true);
    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
    } else {
      setResetRequested(true);
      toast({
        title: language === 'nl' ? "Wachtwoord Reset Aangevraagd" : "Password Reset Requested",
        description: language === 'nl' 
          ? "Als er een account bestaat met dit e-mailadres, ontvangt u binnenkort reset-instructies."
          : "If an account exists with this email, you will receive reset instructions shortly.",
      });
    }
    
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700">E-mail</Label>
        <Input 
          id="email"
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="uw@email.nl"
          required
          autoComplete="email"
          className="bg-blue-50/50 border-slate-200 focus-visible:ring-blue-400"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-slate-700">Wachtwoord</Label>
          <button 
            onClick={handlePasswordReset}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
            disabled={submitting || resetRequested}
          >
            {resetRequested ? "Controleer uw e-mail" : "Wachtwoord vergeten?"}
          </button>
        </div>
        <Input 
          id="password"
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••"
          required
          autoComplete="current-password"
          className="bg-blue-50/50 border-slate-200 focus-visible:ring-blue-400"
        />
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="p-3 bg-blue-50 text-blue-700 rounded-md flex items-start text-sm">
        <LockKeyhole className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <span>Beveiligde verbinding. Wij slaan uw wachtwoord versleuteld op.</span>
      </div>
      
      <div className="flex flex-col items-center space-y-3">
        <Button 
          type="submit" 
          className="bg-[#F97316] hover:bg-[#F97316]/90 w-auto px-12"
          disabled={submitting}
        >
          {submitting ? "Inloggen..." : "Inloggen"}
        </Button>
      </div>

      <SocialAuthButtons context="login" />
    </form>
  );
};

export default LoginForm;
