
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { SocialAuthButtons } from './SocialAuthButtons';

interface RegisterFormProps {
  onSuccess: (message: string) => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Password validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  
  const isPasswordValid = 
    hasMinLength && 
    hasUppercase && 
    hasLowercase && 
    hasNumber && 
    hasSpecialChar;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    // Validate password before submission
    if (!isPasswordValid) {
      setError("Please ensure your password meets all the requirements");
      setSubmitting(false);
      return;
    }
    
    // Check if email is valid
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setSubmitting(false);
      return;
    }
    
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
        
        <div className="text-xs space-y-1 mt-2 bg-gray-50 p-3 rounded-md">
          <p className="font-medium text-brand-mediumgray mb-1">Password requirements:</p>
          <div className="flex items-start gap-2">
            {hasMinLength ? <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" /> : <Info className="h-4 w-4 text-amber-500 mt-0.5" />}
            <p className={`${hasMinLength ? 'text-green-700' : 'text-brand-mediumgray'}`}>At least 8 characters</p>
          </div>
          <div className="flex items-start gap-2">
            {hasUppercase ? <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" /> : <Info className="h-4 w-4 text-amber-500 mt-0.5" />}
            <p className={`${hasUppercase ? 'text-green-700' : 'text-brand-mediumgray'}`}>At least one uppercase letter</p>
          </div>
          <div className="flex items-start gap-2">
            {hasLowercase ? <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" /> : <Info className="h-4 w-4 text-amber-500 mt-0.5" />}
            <p className={`${hasLowercase ? 'text-green-700' : 'text-brand-mediumgray'}`}>At least one lowercase letter</p>
          </div>
          <div className="flex items-start gap-2">
            {hasNumber ? <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" /> : <Info className="h-4 w-4 text-amber-500 mt-0.5" />}
            <p className={`${hasNumber ? 'text-green-700' : 'text-brand-mediumgray'}`}>At least one number</p>
          </div>
          <div className="flex items-start gap-2">
            {hasSpecialChar ? <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" /> : <Info className="h-4 w-4 text-amber-500 mt-0.5" />}
            <p className={`${hasSpecialChar ? 'text-green-700' : 'text-brand-mediumgray'}`}>At least one special character</p>
          </div>
        </div>
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

      <SocialAuthButtons context="register" />
    </form>
  );
};

export default RegisterForm;
