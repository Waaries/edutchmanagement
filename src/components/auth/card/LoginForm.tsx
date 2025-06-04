
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import FormInput from './FormInput';
import RememberMeCheckbox from './RememberMeCheckbox';
import SignInButton from './SignInButton';
import SignUpLink from './SignUpLink';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    
    // Validate input before attempting login
    if (!email.trim()) {
      setError("Voer uw e-mailadres in");
      return;
    }
    
    if (!password.trim()) {
      setError("Voer uw wachtwoord in");
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Voer een geldig e-mailadres in");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Clean up auth state to prevent conflicts
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error:", error.message);
        // Translate all possible error messages to Dutch
        let errorMessage = error.message;
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Ongeldige inloggegevens. Controleer uw e-mailadres en wachtwoord.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "E-mailadres nog niet bevestigd. Controleer uw inbox.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Te veel inlogpogingen. Probeer het later opnieuw.";
        } else if (error.message.includes("missing email") || error.message.includes("missing phone")) {
          errorMessage = "Voer uw e-mailadres en wachtwoord in";
        } else if (error.message.includes("missing password")) {
          errorMessage = "Voer uw wachtwoord in";
        } else if (error.message.includes("invalid email")) {
          errorMessage = "Voer een geldig e-mailadres in";
        } else if (error.message.includes("signup disabled")) {
          errorMessage = "Registratie is momenteel uitgeschakeld";
        } else if (error.message.includes("user not found")) {
          errorMessage = "Gebruiker niet gevonden. Controleer uw gegevens of registreer eerst.";
        } else {
          // Fallback for any other error
          errorMessage = "Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.";
        }
        
        setError(errorMessage);
      } else {
        // Success - show toast and redirect
        toast({
          title: "Ingelogd",
          description: "U bent succesvol ingelogd.",
        });
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Er is een onverwachte fout opgetreden. Probeer het opnieuw.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {/* Email input */}
        <FormInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email adres"
          icon={<Mail className="w-4 h-4" />}
          focusedInput={focusedInput}
          inputName="email"
          onFocus={() => setFocusedInput("email")}
          onBlur={() => setFocusedInput(null)}
        />

        {/* Password input */}
        <FormInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Wachtwoord"
          icon={<Lock className="w-4 h-4" />}
          focusedInput={focusedInput}
          inputName="password"
          onFocus={() => setFocusedInput("password")}
          onBlur={() => setFocusedInput(null)}
        />
      </div>

      {/* Display error if there is one - with better styling */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 shadow-sm">
          <div className="flex items-start">
            <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Remember me & Forgot password */}
      <div className="flex items-center justify-between pt-1">
        <RememberMeCheckbox 
          checked={rememberMe} 
          onChange={() => setRememberMe(!rememberMe)} 
        />
        
        <div className="text-xs relative group/link">
          <Link to="/auth?reset=true" className="text-slate-800 hover:text-brand-blue transition-colors duration-200">
            Wachtwoord vergeten?
          </Link>
        </div>
      </div>

      {/* Sign in button */}
      <SignInButton 
        isLoading={isLoading} 
        onClick={(e) => {/* handled by form submit */}} 
      />

      {/* Sign up link */}
      <SignUpLink />
    </form>
  );
};

export default LoginForm;
