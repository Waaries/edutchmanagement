
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
    if (hash && hash.includes('error')) {
      const errorMessage = new URLSearchParams(hash.substring(1)).get('error_description');
      if (errorMessage) {
        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  }, [location.hash, searchParams, toast]);
}
