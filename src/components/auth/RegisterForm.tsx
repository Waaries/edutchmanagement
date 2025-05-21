
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { translate, language } = useLanguage();
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
    
    // Clean up auth state first to prevent conflicts
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Validate password before submission
    if (!isPasswordValid) {
      setError(language === 'nl' 
        ? "Zorg ervoor dat uw wachtwoord aan alle vereisten voldoet" 
        : "Please ensure your password meets all the requirements");
      setSubmitting(false);
      return;
    }
    
    // Check if email is valid
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(language === 'nl'
        ? "Voer een geldig e-mailadres in"
        : "Please enter a valid email address");
      setSubmitting(false);
      return;
    }
    
    const { error } = await signUp(email, password, firstName, lastName);
    
    if (error) {
      // Provide more user-friendly Dutch error messages
      let errorMessage = error.message;
      
      if (error.message.includes('User already registered')) {
        errorMessage = language === 'nl'
          ? "Dit e-mailadres is al geregistreerd. Probeer in te loggen of gebruik een ander e-mailadres."
          : "This email is already registered. Try logging in or use a different email address.";
      } else if (error.message.includes('Invalid email')) {
        errorMessage = language === 'nl'
          ? "Ongeldig e-mailadres. Controleer het e-mailadres en probeer het opnieuw."
          : "Invalid email address. Please check and try again.";
      } else if (error.message.includes('Password should be')) {
        errorMessage = language === 'nl'
          ? "Wachtwoord voldoet niet aan de veiligheidseisen. Probeer een ander wachtwoord."
          : "Password doesn't meet security requirements. Please try a different password.";
      }
      
      setError(errorMessage);
    } else {
      onSuccess(language === 'nl'
        ? "Registratie succesvol! Controleer uw e-mail om uw account te bevestigen."
        : "Registration successful! Please check your email to confirm your account.");
    }
    
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{translate("auth.register.firstName")}</Label>
          <Input 
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={translate("auth.register.firstNamePlaceholder")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">{translate("auth.register.lastName")}</Label>
          <Input 
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={translate("auth.register.lastNamePlaceholder")}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="registerEmail">{translate("auth.register.email")}</Label>
        <Input 
          id="registerEmail"
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={translate("auth.register.emailPlaceholder")}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="registerPassword">{translate("auth.register.password")}</Label>
        <Input 
          id="registerPassword"
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={translate("auth.register.passwordPlaceholder")}
          required
        />
        
        <div className="text-xs space-y-1 mt-2 bg-gray-50 p-3 rounded-md">
          <p className="font-medium text-brand-mediumgray mb-1">{translate("auth.register.passwordRequirements")}</p>
          <div className="flex items-start gap-2">
            {hasMinLength ? <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" /> : <Info className="h-4 w-4 text-amber-500 mt-0.5" />}
            <p className={`${hasMinLength ? 'text-green-700' : 'text-brand-mediumgray'}`}>{translate("auth.register.minLength")}</p>
          </div>
          <div className="flex items-start gap-2">
            {hasUppercase ? <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" /> : <Info className="h-4 w-4 text-amber-500 mt-0.5" />}
            <p className={`${hasUppercase ? 'text-green-700' : 'text-brand-mediumgray'}`}>{translate("auth.register.uppercase")}</p>
          </div>
          <div className="flex items-start gap-2">
            {hasLowercase ? <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" /> : <Info className="h-4 w-4 text-amber-500 mt-0.5" />}
            <p className={`${hasLowercase ? 'text-green-700' : 'text-brand-mediumgray'}`}>{translate("auth.register.lowercase")}</p>
          </div>
          <div className="flex items-start gap-2">
            {hasNumber ? <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" /> : <Info className="h-4 w-4 text-amber-500 mt-0.5" />}
            <p className={`${hasNumber ? 'text-green-700' : 'text-brand-mediumgray'}`}>{translate("auth.register.number")}</p>
          </div>
          <div className="flex items-start gap-2">
            {hasSpecialChar ? <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" /> : <Info className="h-4 w-4 text-amber-500 mt-0.5" />}
            <p className={`${hasSpecialChar ? 'text-green-700' : 'text-brand-mediumgray'}`}>{translate("auth.register.special")}</p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex flex-col items-center space-y-3">
        <Button 
          type="submit" 
          className="bg-[#F97316] hover:bg-[#F97316]/90 w-auto px-12"
          disabled={submitting}
        >
          {submitting 
            ? (language === 'nl' ? "Account aanmaken..." : translate("auth.register.creating")) 
            : (language === 'nl' ? "Account aanmaken" : translate("auth.register.button"))}
        </Button>
      </div>

      <SocialAuthButtons context="register" />
    </form>
  );
};

export default RegisterForm;
