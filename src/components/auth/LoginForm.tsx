
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, LockKeyhole, Eye, EyeOff } from 'lucide-react';
import { SocialAuthButtons } from './SocialAuthButtons';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { devLog } from "@/lib/logger";

const LoginForm = () => {
  const { signIn, resetPassword } = useAuth();
  const { translate, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      devLog("Login failed:", error.message);
      
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
      
      devLog("Login successful, checking admin status for redirect");
      
      // Check admin status to determine redirect destination
      try {
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
        
        if (adminError) {
          console.error('Error checking admin status:', adminError);
          // Default to user dashboard if admin check fails
          window.location.href = '/dashboard';
        } else {
          // Redirect based on admin status
          const redirectUrl = isAdmin ? '/admin' : '/dashboard';
          devLog("Redirecting to:", redirectUrl, "isAdmin:", isAdmin);
          window.location.href = redirectUrl;
        }
      } catch (err) {
        console.error('Failed to check admin status:', err);
        // Default to user dashboard if admin check fails
        window.location.href = '/dashboard';
      }
    }
    
    setSubmitting(false);
  };

  const handlePasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    
    if (!email || !email.trim()) {
      setError("Voer eerst uw e-mailadres in om uw wachtwoord te resetten");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Voer een geldig e-mailadres in");
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        console.error('Password reset error:', error);
        setError(error.message);
      } else {
        setResetRequested(true);
        toast({
          title: "Wachtwoord Reset Verzonden",
          description: "Als er een account bestaat met dit e-mailadres, ontvangt u binnenkort reset-instructies.",
        });
        setError(null);
      }
    } catch (err) {
      console.error('Unexpected password reset error:', err);
      setError("Er is een fout opgetreden bij het resetten van uw wachtwoord.");
    }
    
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700 font-medium">E-mail</Label>
        <Input 
          id="email"
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="uw@email.nl"
          required
          autoComplete="email"
          className="bg-blue-50/30 border-slate-200 focus-visible:ring-blue-400 rounded-xl h-12"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-slate-700 font-medium">Wachtwoord</Label>
          <button 
            type="button"
            onClick={handlePasswordReset}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
            disabled={submitting || resetRequested}
          >
            {resetRequested ? "Controleer uw e-mail" : "Wachtwoord vergeten?"}
          </button>
        </div>
        <div className="relative">
          <Input 
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            required
            autoComplete="current-password"
            className="bg-blue-50/30 border-slate-200 focus-visible:ring-blue-400 rounded-xl h-12 pr-10"
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      
      <div className="flex justify-center pt-3">
        <Button 
          type="submit" 
          className="bg-[#F97316] hover:bg-[#F97316]/90 px-10 py-6 shadow-lg shadow-orange-300/30 rounded-xl w-full"
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
