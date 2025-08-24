
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, LockKeyhole, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const SimpleAuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();

  // Determine if we should show register form
  const isRegisterMode = searchParams.get('register') === 'true';
  const [currentMode, setCurrentMode] = useState<'login' | 'register'>(
    isRegisterMode ? 'register' : 'login'
  );

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetRequested, setResetRequested] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Password validation schema
  const passwordSchema = z.string()
    .min(8, "Wachtwoord moet minimaal 8 tekens bevatten")
    .regex(/[A-Z]/, "Wachtwoord moet minimaal 1 hoofdletter bevatten")
    .regex(/[0-9]/, "Wachtwoord moet minimaal 1 cijfer bevatten");

  // Update mode when URL changes
  useEffect(() => {
    const newMode = searchParams.get('register') === 'true' ? 'register' : 'login';
    console.log('URL changed, setting mode to:', newMode);
    setCurrentMode(newMode);
    setError(null); // Clear errors when switching modes
  }, [searchParams]);

  const switchMode = (mode: 'login' | 'register') => {
    console.log('Switching to mode:', mode);
    setCurrentMode(mode);
    setError(null);
    
    if (mode === 'register') {
      navigate('/auth?register=true', { replace: true });
    } else {
      navigate('/auth', { replace: true });
    }
  };

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    if (loginAttempts >= 5) {
      setError("Te veel inlogpogingen. Probeer later opnieuw of reset uw wachtwoord.");
      setSubmitting(false);
      return;
    }
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setLoginAttempts(prev => prev + 1);
      setError(error.message);
      
      if (loginAttempts >= 2) {
        setError(`${error.message} U kunt overwegen uw wachtwoord te resetten.`);
      }
    } else {
      setLoginAttempts(0);
      toast({
        title: "Ingelogd",
        description: "U bent succesvol ingelogd.",
      });
      
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
          console.log("SimpleAuth redirecting to:", redirectUrl, "isAdmin:", isAdmin);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
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
    
    const { error } = await signUp(email, password, {
      first_name: name,
      last_name: ""
    });
    
    if (error) {
      setError(error.message);
    } else {
      toast({
        title: "Account Aangemaakt",
        description: "Uw account is succesvol aangemaakt! Bekijk uw e-mail om uw account te verifiëren.",
      });
      switchMode('login');
    }
    
    setSubmitting(false);
  };

  const handlePasswordReset = async () => {
    if (!email || !email.trim()) {
      setError("Voer eerst uw e-mailadres in om uw wachtwoord te resetten");
      return;
    }
    
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
      setError("Er is een fout opgetreden bij het resetten van uw wachtwoord.");
    }
    
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen w-screen bg-white relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-gray-100" />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-blue-500/5 blur-[80px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-lg">
          {/* Back to Home Button */}
          <div className="absolute top-4 left-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 p-2 h-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Terug
            </Button>
          </div>

          {/* Header */}
          <div className="text-center space-y-1 mb-6">
            <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center relative overflow-hidden">
              <img 
                src="/lovable-uploads/deaf856d-a351-405b-8032-bb4d4f682ff4.png" 
                alt="eDutch Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-slate-800">
              {currentMode === 'login' ? 'Welkom Terug' : 'Account Aanmaken'}
            </h1>
            <p className="text-slate-600 text-xs">
              {currentMode === 'login' 
                ? 'Log in om door te gaan naar eDutch'
                : 'Maak een account aan voor eDutch'
              }
            </p>
          </div>

          {/* Mode Toggle Buttons */}
          <div className="grid grid-cols-2 gap-1 mb-6 bg-gray-100/50 rounded-xl p-1">
            <button
              onClick={() => switchMode('login')}
              className={`text-sm font-medium rounded-lg py-2 px-3 transition-all duration-200 ${
                currentMode === 'login' 
                  ? 'bg-white shadow-sm text-slate-900' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inloggen
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`text-sm font-medium rounded-lg py-2 px-3 transition-all duration-200 ${
                currentMode === 'register' 
                  ? 'bg-white shadow-sm text-slate-900' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Registreren
            </button>
          </div>

          {/* Login Form */}
          {currentMode === 'login' && (
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
              
              
              <Button 
                type="submit" 
                className="bg-[#F97316] hover:bg-[#F97316]/90 px-10 py-6 shadow-lg shadow-orange-300/30 rounded-xl w-full"
                disabled={submitting}
              >
                {submitting ? "Inloggen..." : "Inloggen"}
              </Button>
            </form>
          )}

          {/* Register Form */}
          {currentMode === 'register' && (
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

              
              <Button 
                type="submit" 
                className="bg-[#F97316] hover:bg-[#F97316]/90 px-10 py-6 shadow-lg shadow-orange-300/30 rounded-xl w-full"
                disabled={submitting}
              >
                {submitting ? "Account aanmaken..." : "Account aanmaken"}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SimpleAuthPage;
