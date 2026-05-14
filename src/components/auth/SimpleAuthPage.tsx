
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import logoLight from '@/assets/logo-light.png';

const SimpleAuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();

  const isRegisterMode = searchParams.get('register') === 'true';
  const [currentMode, setCurrentMode] = useState<'login' | 'register'>(
    isRegisterMode ? 'register' : 'login'
  );

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

  const passwordSchema = z.string()
    .min(8, "Wachtwoord moet minimaal 8 tekens bevatten")
    .regex(/[A-Z]/, "Wachtwoord moet minimaal 1 hoofdletter bevatten")
    .regex(/[0-9]/, "Wachtwoord moet minimaal 1 cijfer bevatten");

  useEffect(() => {
    const newMode = searchParams.get('register') === 'true' ? 'register' : 'login';
    setCurrentMode(newMode);
    setError(null);
  }, [searchParams]);

  const switchMode = (mode: 'login' | 'register') => {
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
      toast({ title: "Ingelogd", description: "U bent succesvol ingelogd." });
      setTimeout(async () => {
        try {
          const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
          if (adminError) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
          }
        } catch {
          navigate('/dashboard', { replace: true });
        }
      }, 300);
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
    if (!validatePassword()) return;

    setSubmitting(true);
    const { error } = await signUp(email, password, { first_name: name, last_name: "" });

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
    } catch {
      setError("Er is een fout opgetreden bij het resetten van uw wachtwoord.");
    }

    setSubmitting(false);
  };

  const inputClass = "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 focus-visible:border-blue-500/50 rounded-xl h-12";

  return (
    <div className="min-h-screen w-screen bg-slate-950 relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Decorative glows matching Hero/Footer */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-indigo-900/30 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-1 backdrop-blur-xl shadow-2xl">
          <div className="rounded-[22px] bg-slate-900/60 backdrop-blur-md p-7 sm:p-8 relative">
            {/* Back to Home */}
            <div className="absolute top-4 left-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-slate-300 hover:text-white hover:bg-white/10 p-2 h-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Terug
              </Button>
            </div>

            {/* Header */}
            <div className="text-center space-y-2 mb-6 pt-8">
              <div className="mx-auto mb-2 flex items-center justify-center">
                <img
                  src={logoLight}
                  alt="eDutch Management Logo"
                  className="h-20 w-auto object-contain drop-shadow-[0_0_18px_rgba(96,165,250,0.4)]"
                />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {currentMode === 'login' ? 'Welkom Terug' : 'Account Aanmaken'}
              </h1>
              <p className="text-slate-400 text-sm">
                {currentMode === 'login'
                  ? 'Log in om door te gaan naar eDutch'
                  : 'Maak een account aan voor eDutch'}
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="grid grid-cols-2 gap-1 mb-6 bg-white/5 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => switchMode('login')}
                className={`text-sm font-semibold rounded-lg py-2 px-3 transition-all duration-200 ${
                  currentMode === 'login'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Inloggen
              </button>
              <button
                onClick={() => switchMode('register')}
                className={`text-sm font-semibold rounded-lg py-2 px-3 transition-all duration-200 ${
                  currentMode === 'register'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Registreren
              </button>
            </div>

            {/* Login */}
            {currentMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200 font-medium">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="uw@email.nl"
                    required
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-slate-200 font-medium">Wachtwoord</Label>
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors"
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
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl flex items-start text-sm">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-xl py-6 text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 transition-all"
                  disabled={submitting}
                >
                  {submitting ? "Inloggen..." : "Inloggen"}
                </Button>
              </form>
            )}

            {/* Register */}
            {currentMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200 font-medium">Naam</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Uw volledige naam"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-slate-200 font-medium">E-mail</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="uw@email.nl"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-slate-200 font-medium">Wachtwoord</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      required
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-slate-200 font-medium">Bevestig wachtwoord</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••"
                      required
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2 my-4">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                    className="mt-0.5 bg-white/5 border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-300 leading-snug">
                    Ik ga akkoord met de algemene voorwaarden en het privacybeleid
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl flex items-start text-sm">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-xl py-6 text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 transition-all"
                  disabled={submitting}
                >
                  {submitting ? "Account aanmaken..." : "Account aanmaken"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SimpleAuthPage;
