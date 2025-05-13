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
      setError("Too many login attempts. Please try again later or reset your password.");
      setSubmitting(false);
      return;
    }
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setLoginAttempts(prev => prev + 1);
      setError(error.message);
      
      // After 3 failed attempts, suggest password reset
      if (loginAttempts >= 2) {
        setError(`${error.message} You may want to reset your password.`);
      }
    } else {
      // Reset login attempts on successful login
      setLoginAttempts(0);
      toast({
        title: language === 'nl' ? "Ingelogd" : "Logged In",
        description: language === 'nl' ? "U bent succesvol ingelogd." : "You have successfully logged in.",
      });
      
      // Wait a bit before redirecting to make sure admin status is updated
      setTimeout(() => {
        if (isAdmin) {
          navigate('/admin');
          console.log('Redirecting to admin dashboard');
        } else {
          navigate('/');
          console.log('Redirecting to home page');
        }
      }, 1000);
    }
    
    setSubmitting(false);
  };

  const handlePasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address to reset your password");
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
        <Label htmlFor="email">{translate("auth.login.email")}</Label>
        <Input 
          id="email"
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={translate("auth.login.emailPlaceholder")}
          required
          autoComplete="email"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">{translate("auth.login.password")}</Label>
          <button 
            onClick={handlePasswordReset}
            className="text-xs text-primary hover:underline"
            disabled={submitting || resetRequested}
          >
            {resetRequested ? translate("auth.login.checkEmail") : translate("auth.login.forgotPassword")}
          </button>
        </div>
        <Input 
          id="password"
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={translate("auth.login.passwordPlaceholder")}
          required
          autoComplete="current-password"
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
        <span>{translate("auth.login.secure")}</span>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-[#F97316] hover:bg-[#F97316]/90"
        disabled={submitting}
      >
        {submitting 
          ? (language === 'nl' ? "Inloggen..." : translate("auth.login.loggingIn")) 
          : (language === 'nl' ? "Inloggen" : translate("auth.login.button"))}
      </Button>

      <SocialAuthButtons context="login" />
    </form>
  );
};

export default LoginForm;
