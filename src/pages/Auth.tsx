
import { useState, useEffect } from 'react';
import { Navigate, useLocation, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePasswordReset } from '@/hooks/use-password-reset';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import SuccessDialog from '@/components/auth/SuccessDialog';
import { Shield, HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Auth = () => {
  const { user, loading, isAdmin } = useAuth();
  const { translate } = useLanguage();
  const [success, setSuccess] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('login');
  const [error, setError] = useState<string | null>(null);
  
  // Use the password reset hook
  usePasswordReset();

  // Check if coming back from OAuth redirect or password reset
  useEffect(() => {
    // Check URL params
    const reset = searchParams.get('reset');
    if (reset === 'true') {
      setSuccess("U kunt nu een nieuw wachtwoord instellen.");
      setShowDialog(true);
    }
    
    // Check if 'register' is in the URL, show the register tab
    if (location.search.includes('register')) {
      setActiveTab('register');
    }
    
    // Set activeTab to login if there's an error in the URL hash
    if (location.hash && location.hash.includes('error')) {
      setActiveTab('login');
      setError("Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.");
      // Clear the hash to prevent showing the error again
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, document.title, window.location.pathname);
      }
    }
  }, [location, searchParams]);

  // If user is already logged in, redirect to appropriate page
  useEffect(() => {
    if (user && !loading) {
      console.log("User is logged in, redirecting to appropriate page:", isAdmin ? "/admin" : "/dashboard");
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, loading, isAdmin, navigate]);

  // Show loading indicator when checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Bezig met laden...</p>
        </div>
      </div>
    );
  }

  // If user is already logged in, don't render the auth page
  if (user) {
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} />;
  }

  const handleRegistrationSuccess = (message: string) => {
    setSuccess(message);
    setShowDialog(true);
  };

  return (
    <div className="bg-brand-silver min-h-screen pt-32 pb-12 px-4">
      <div className="max-w-md mx-auto glass-card rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-brand-mediumgray hover:text-primary"
            >
              <HomeIcon size={18} />
              <span>{translate("auth.backToHome")}</span>
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">{translate("auth.welcome")}</h1>
          <p className="text-brand-mediumgray mt-2">{translate("auth.welcomeDesc")}</p>
        </div>

        <div className="flex justify-center items-center mb-6">
          <div className="bg-blue-50 p-2 rounded-full">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <span className="ml-2 text-sm text-blue-700">{translate("auth.secureAuth")}</span>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">{translate("auth.login.title")}</TabsTrigger>
            <TabsTrigger value="register">{translate("auth.register.title")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm onSuccess={handleRegistrationSuccess} />
          </TabsContent>
        </Tabs>
      </div>

      <SuccessDialog 
        open={showDialog} 
        onOpenChange={setShowDialog} 
        message={success || ''} 
      />
    </div>
  );
};

export default Auth;
