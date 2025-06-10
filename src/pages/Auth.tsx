
import { useState, useEffect } from 'react';
import { Navigate, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePasswordReset } from '@/hooks/use-password-reset';
import SimpleAuthPage from '@/components/auth/SimpleAuthPage';
import SuccessDialog from '@/components/auth/SuccessDialog';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/ui/loading-spinner';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  
  // Safely get auth context with error handling
  let authContext;
  try {
    authContext = useAuth();
  } catch (err) {
    console.error('Auth context error:', err);
    // If auth context fails, show loading state and retry
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4">Authenticatie wordt geladen...</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90"
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    );
  }

  const { user, loading, isAdmin, initialized } = authContext;
  const { translate } = useLanguage();

  // Use the password reset hook
  usePasswordReset();

  useEffect(() => {
    // Check URL params
    const reset = searchParams.get('reset');
    if (reset === 'true') {
      setSuccess("U kunt nu een nieuw wachtwoord instellen.");
      setShowDialog(true);
    }

    // Set error if there's an error in the URL hash
    if (location.hash && location.hash.includes('error')) {
      setError("Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.");
      // Clear the hash to prevent showing the error again
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, document.title, window.location.pathname);
      }
    }
  }, [location, searchParams]);

  useEffect(() => {
    // Only check for redirects if auth is initialized
    if (!initialized) {
      console.log('Auth not yet initialized in Auth page');
      return;
    }

    if (user && !loading && !isRedirecting) {
      console.log("User is logged in, redirecting to appropriate page:", isAdmin ? "/admin" : "/dashboard");
      
      setIsRedirecting(true);
      // Use setTimeout to ensure state is properly set
      setTimeout(() => {
        if (isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 100);
    }
  }, [user, loading, isAdmin, initialized, navigate, isRedirecting]);

  // Show loading while auth is initializing
  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4">Bezig met laden...</p>
        </div>
      </div>
    );
  }

  // If user is already logged in, don't render the auth page
  if (user) {
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }

  // Render success dialog if needed
  if (showDialog && success) {
    return (
      <ErrorBoundary>
        <SuccessDialog 
          open={showDialog}
          onOpenChange={(open) => {
            if (!open) {
              setShowDialog(false);
              setSuccess(null);
            }
          }}
          message={success}
        />
      </ErrorBoundary>
    );
  }
  
  // Use the new SimpleAuthPage component
  return (
    <ErrorBoundary>
      <SimpleAuthPage />
    </ErrorBoundary>
  );
};

export default Auth;
