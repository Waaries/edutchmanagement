
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
    setIsLoading(true);
    setError("");
    
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
        setError(error.message);
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

      {/* Display error if there is one */}
      {error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-white/90">
          {error}
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
