import { useState, useEffect } from 'react';
import { Navigate, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePasswordReset } from '@/hooks/use-password-reset';
import SignInCard from '@/components/ui/sign-in-card-2';
import SuccessDialog from '@/components/auth/SuccessDialog';

const Auth = () => {
  const {
    user,
    loading,
    isAdmin
  } = useAuth();
  const {
    translate
  } = useLanguage();
  const [success, setSuccess] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('login');
  const [error, setError] = useState<string | null>(null);

  // Use the password reset hook
  usePasswordReset();

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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Bezig met laden...</p>
        </div>
      </div>;
  }

  // If user is already logged in, don't render the auth page
  if (user) {
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} />;
  }

  // Render success dialog if needed
  if (showDialog && success) {
    return <SuccessDialog 
      open={showDialog}
      onOpenChange={(open) => {
        if (!open) {
          setShowDialog(false);
          setSuccess(null);
        }
      }}
      message={success}
    />;
  }
  
  // Use the SignInCard component
  return <SignInCard />;
};

export default Auth;
