
import { useState, useEffect } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import SuccessDialog from '@/components/auth/SuccessDialog';
import { Shield } from 'lucide-react';

const Auth = () => {
  const { user, signInWithGoogle, signInWithFacebook, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const location = useLocation();
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
      }
    }
    
    // If 'register' is in the URL, show the register tab
    if (location.search.includes('register')) {
      setActiveTab('register');
    }
  }, [location, searchParams]);

  // If user is already logged in, redirect to home
  if (user && !loading) {
    return <Navigate to="/" />;
  }

  const handleGoogleSignIn = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    setError(null);
    const { error } = await signInWithFacebook();
    if (error) {
      setError(error.message);
    }
  };

  const handleRegistrationSuccess = (message: string) => {
    setSuccess(message);
    setShowDialog(true);
  };

  const socialAuthHandlers = {
    handleGoogleSignIn,
    handleFacebookSignIn
  };

  return (
    <div className="bg-brand-silver min-h-screen pt-32 pb-12 px-4">
      <div className="max-w-md mx-auto glass-card rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome to eDutch Management</h1>
          <p className="text-brand-mediumgray mt-2">Login or create an account to continue</p>
        </div>

        <div className="flex justify-center items-center mb-6">
          <div className="bg-blue-50 p-2 rounded-full">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <span className="ml-2 text-sm text-blue-700">Secure authentication</span>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onSocialAuth={socialAuthHandlers} />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm 
              onSuccess={handleRegistrationSuccess} 
              onSocialAuth={socialAuthHandlers} 
            />
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
