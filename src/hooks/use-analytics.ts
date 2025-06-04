
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  initializeAnalytics, 
  trackPageView, 
  trackEvent, 
  trackFormSubmission, 
  trackButtonClick, 
  trackNavigation 
} from '@/lib/analytics';
import { hasAnalyticsConsent } from '@/lib/cookie-utils';

export const useAnalytics = () => {
  const location = useLocation();

  // Initialize analytics on mount if consent is given
  useEffect(() => {
    if (hasAnalyticsConsent()) {
      initializeAnalytics();
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (hasAnalyticsConsent()) {
      trackPageView(location.pathname + location.search, document.title);
    }
  }, [location]);

  return {
    trackEvent,
    trackFormSubmission,
    trackButtonClick,
    trackNavigation,
  };
};
