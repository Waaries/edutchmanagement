
import { Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import FormInput from './FormInput';
import RememberMeCheckbox from './RememberMeCheckbox';
import SignInButton from './SignInButton';
import SignUpLink from './SignUpLink';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
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

      {/* Remember me & Forgot password */}
      <div className="flex items-center justify-between pt-1">
        <RememberMeCheckbox 
          checked={rememberMe} 
          onChange={() => setRememberMe(!rememberMe)} 
        />
        
        <div className="text-xs relative group/link">
          <Link to="/auth?reset=true" className="text-white/60 hover:text-white transition-colors duration-200">
            Wachtwoord vergeten?
          </Link>
        </div>
      </div>

      {/* Sign in button */}
      <SignInButton 
        isLoading={isLoading} 
        onClick={(e) => {
          e.preventDefault();
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 2000);
        }} 
      />

      {/* Sign up link */}
      <SignUpLink />
    </form>
  );
};

export default LoginForm;
