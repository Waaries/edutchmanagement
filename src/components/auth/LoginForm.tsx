
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { SocialAuthButtons } from './SocialAuthButtons';

interface LoginFormProps {
  onSocialAuth: {
    handleGoogleSignIn: () => Promise<void>;
    handleFacebookSignIn: () => Promise<void>;
  };
}

const LoginForm = ({ onSocialAuth }: LoginFormProps) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
    }
    
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password"
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
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
        {submitting ? 'Logging in...' : 'Login'}
      </Button>

      <SocialAuthButtons 
        onGoogleSignIn={onSocialAuth.handleGoogleSignIn}
        onFacebookSignIn={onSocialAuth.handleFacebookSignIn}
        context="login"
      />
    </form>
  );
};

export default LoginForm;
