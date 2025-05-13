
import { useState, useEffect } from 'react';
import { Navigate, useLocation, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import SuccessDialog from '@/components/auth/SuccessDialog';
import { Shield, HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Auth = () => {
  const { user, loading, isAdmin } = useAuth();
  const { translate } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('login');

  // Check if coming back from OAuth redirect or password reset
  useEffect(() => {
    // Check URL params
    const reset = searchParams.get('reset');
    if (reset === 'true') {
      setSuccess("You can now set a new password.");
      setShowDialog(true);
    }
    
    // Check hash for OAuth redirects
    const hash = location.hash;
    if (hash && (hash.includes('access_token') || hash.includes('error'))) {
      // Clear the hash after checking
      window.history.replaceState(null, document.title, window.location.pathname);
      
      // Check for errors
      if (hash.includes('error')) {
        const errorMessage = new URLSearchParams(hash.substring(1)).get('error_description');
        setError(errorMessage || 'Authentication failed');
      } else if (hash.includes('access_token')) {
        // If OAuth login was successful, redirect after a short delay
        setTimeout(() => {
          if (isAdmin) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1000);
      }
    }
    
    // If 'register' is in the URL, show the register tab
    if (location.search.includes('register')) {
      setActiveTab('register');
    }
  }, [location, searchParams, navigate, isAdmin]);

  // If user is already logged in, redirect to appropriate page
  useEffect(() => {
    if (user && !loading) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, loading, isAdmin, navigate]);

  // If user is already logged in, don't render the auth page
  if (user && !loading) {
    return null;
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
