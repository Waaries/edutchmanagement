
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { SocialAuthButtons } from './SocialAuthButtons';
import { z } from 'zod';

interface RegisterFormProps {
  onSuccess: (message: string) => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { signUp } = useAuth();
  const { translate, language } = useLanguage();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password validation schema
  const passwordSchema = z.string()
    .min(8, "Wachtwoord moet minimaal 8 tekens bevatten")
    .regex(/[A-Z]/, "Wachtwoord moet minimaal 1 hoofdletter bevatten")
    .regex(/[0-9]/, "Wachtwoord moet minimaal 1 cijfer bevatten");

  const validatePassword = () => {
    try {
      passwordSchema.parse(password);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      }
      return false;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Form validation
    if (!termsAccepted) {
      setError("U moet akkoord gaan met de voorwaarden om een account aan te maken.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }
    
    if (!validatePassword()) {
      return;
    }
    
    setSubmitting(true);
    
    // Clean up auth state first to prevent conflicts
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    const { error } = await signUp(email, password, {
      first_name: name,
      last_name: ""
    });
    
    if (error) {
      console.error("Registration error:", error.message);
      setError(error.message);
    } else {
      onSuccess(
        language === 'nl' 
          ? "Uw account is succesvol aangemaakt! Bekijk uw e-mail om uw account te verifiëren."
          : "Your account has been created successfully! Please check your email to verify your account."
      );
    }
    
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-700 font-medium">Naam</Label>
        <Input 
          id="name"
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Uw volledige naam"
          required
          className="bg-blue-50/30 border-slate-200 focus-visible:ring-blue-400 rounded-xl h-12"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reg-email" className="text-slate-700 font-medium">E-mail</Label>
        <Input 
          id="reg-email"
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="uw@email.nl"
          required
          className="bg-blue-50/30 border-slate-200 focus-visible:ring-blue-400 rounded-xl h-12"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reg-password" className="text-slate-700 font-medium">Wachtwoord</Label>
        <div className="relative">
          <Input 
            id="reg-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            required
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
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-slate-700 font-medium">Bevestig wachtwoord</Label>
        <div className="relative">
          <Input 
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••"
            required
            className="bg-blue-50/30 border-slate-200 focus-visible:ring-blue-400 rounded-xl h-12 pr-10"
          />
          <button 
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 my-4">
        <Checkbox 
          id="terms" 
          checked={termsAccepted} 
          onCheckedChange={(checked) => setTermsAccepted(checked === true)}
          className="bg-blue-50 border-slate-300 text-blue-600"
        />
        <label
          htmlFor="terms"
          className="text-sm text-slate-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Ik ga akkoord met de algemene voorwaarden en het privacybeleid
        </label>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="p-4 bg-blue-50 text-blue-700 rounded-xl flex items-start text-sm">
        <ShieldCheck className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <span>Beveiligde registratie. Uw gegevens worden versleuteld opgeslagen.</span>
      </div>
      
      <div className="flex justify-center pt-3">
        <Button 
          type="submit" 
          className="bg-[#F97316] hover:bg-[#F97316]/90 px-10 py-6 shadow-lg shadow-orange-300/30 rounded-xl w-full"
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
