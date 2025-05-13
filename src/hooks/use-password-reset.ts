
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useSearchParams } from 'react-router-dom';

export function usePasswordReset() {
  const { toast } = useToast();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Check if coming back from password reset
    const reset = searchParams.get('reset');
    if (reset === 'true') {
      toast({
        title: "Password Recovery",
        description: "Follow the instructions sent to your email to reset your password.",
      });
    }

    // Check hash for OAuth redirects or errors
    const hash = location.hash;
    if (hash) {
      // Remove the leading # and parse the hash as query parameters
      const hashParams = new URLSearchParams(hash.substring(1));
      
      // Check for error in hash
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');
      
      if (error) {
        // Show error message with more user-friendly description
        let errorMessage = errorDescription || 'An authentication error occurred.';
        
        // Make specific error messages more user friendly
        if (error === 'access_denied' && errorDescription?.includes('Email link is invalid or has expired')) {
          errorMessage = 'De activatielink is verlopen of ongeldig. Vraag een nieuwe link aan via de login pagina.';
        }
        
        toast({
          title: "Authenticatie Fout",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Clear the hash from URL to prevent showing the error again on refresh
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, document.title, window.location.pathname);
        }
      }
    }
  }, [location.hash, searchParams, toast]);
}
