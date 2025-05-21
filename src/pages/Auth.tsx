
import { useState, useEffect } from 'react';
import { Navigate, useLocation, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePasswordReset } from '@/hooks/use-password-reset';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import SuccessDialog from '@/components/auth/SuccessDialog';
import { Shield, HomeIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-100">
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
    <div className="bg-gradient-to-b from-white to-slate-100 min-h-screen flex flex-col justify-center items-center py-12 px-4">
      <Card className="max-w-md w-full mx-auto shadow-xl border-0 rounded-2xl overflow-hidden">
        <div className="p-6 pb-0">
          <Link to="/" className="inline-block mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-slate-500 hover:text-primary text-sm"
            >
              <HomeIcon size={16} />
              <span>{translate("auth.backToHome")}</span>
            </Button>
          </Link>

          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/3794fc88-3e28-4692-b1f9-83f893bf0ada.png" 
                alt="e-Dutch Logo" 
                className="h-20 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Welkom bij eDutch Management</h1>
            <p className="text-slate-500 mt-2 text-sm">Log in of maak een account aan</p>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 px-6">
            <TabsTrigger value="login" className="rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none">Inloggen</TabsTrigger>
            <TabsTrigger value="register" className="rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none">Registreren</TabsTrigger>
          </TabsList>
          
          <CardContent className="pt-4">
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm onSuccess={handleRegistrationSuccess} />
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <div className="flex justify-center items-center py-3 text-xs text-slate-400 bg-slate-50 border-t border-slate-100">
          <Shield className="h-3 w-3 mr-1 text-slate-400" />
          <span>BEVEILIGDE AUTHENTICATIE</span>
        </div>
      </Card>

      <SuccessDialog 
        open={showDialog} 
        onOpenChange={setShowDialog} 
        message={success || ''} 
      />
    </div>
  );
};

export default Auth;
