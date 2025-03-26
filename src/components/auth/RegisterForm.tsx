
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { SocialAuthButtons } from './SocialAuthButtons';

interface RegisterFormProps {
  onSuccess: (message: string) => void;
  onSocialAuth: {
    handleGoogleSignIn: () => Promise<void>;
    handleFacebookSignIn: () => Promise<void>;
  };
}

const RegisterForm = ({ onSuccess, onSocialAuth }: RegisterFormProps) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    const { error } = await signUp(email, password, firstName, lastName);
    
    if (error) {
      setError(error.message);
    } else {
      onSuccess("Registration successful! Please check your email to confirm your account.");
    }
    
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="registerEmail">Email</Label>
        <Input 
          id="registerEmail"
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="registerPassword">Password</Label>
        <Input 
          id="registerPassword"
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <p className="text-xs text-brand-mediumgray">Password must be at least 6 characters</p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-[#F97316] hover:bg-[#F97316]/90"
        disabled={submitting}
      >
        {submitting ? 'Creating account...' : 'Create Account'}
      </Button>

      <SocialAuthButtons 
        onGoogleSignIn={onSocialAuth.handleGoogleSignIn}
        onFacebookSignIn={onSocialAuth.handleFacebookSignIn}
        context="register"
      />
    </form>
  );
};

export default RegisterForm;
