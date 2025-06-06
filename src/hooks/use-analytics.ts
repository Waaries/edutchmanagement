
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  initializeAnalytics, 
  forceInitializeAnalytics,
  trackPageView, 
  trackEvent, 
  trackFormSubmission, 
  trackButtonClick, 
  trackNavigation,
  isAnalyticsInitialized,
  getAnalyticsDebugInfo
} from '@/lib/analytics';
import { hasAnalyticsConsent } from '@/lib/cookie-utils';
import { isProduction } from '@/lib/analytics-config';
import { shouldTrackAnalytics } from '@/lib/analytics-consent';

export const useAnalytics = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  // Initialize analytics on mount
  useEffect(() => {
    console.log('[Analytics Hook] Initializing analytics hook');
    
    // Only initialize in browser environment
    if (typeof window === 'undefined') return;
    
    const initAnalytics = async () => {
      try {
        if (isProduction()) {
          console.log('[Analytics Hook] Production environment detected');
          await forceInitializeAnalytics();
        } else {
          console.log('[Analytics Hook] Development environment');
          await initializeAnalytics();
        }
        setInitialized(true);
      } catch (error) {
        console.error('[Analytics Hook] Failed to initialize analytics:', error);
      }
    };

    // Start initialization with a small delay to ensure DOM is ready
    setTimeout(initAnalytics, 100);

    return () => {
      console.log('[Analytics Hook] Cleaning up analytics hook');
    };
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (typeof window === 'undefined' || !initialized) return;
    
    const trackPageViewDelayed = () => {
      if (shouldTrackAnalytics() && isAnalyticsInitialized()) {
        console.log(`[Analytics Hook] Tracking page view: ${location.pathname}`);
        trackPageView(location.pathname + location.search, document.title);
      } else {
        console.log(`[Analytics Hook] Skipping page view - should track: ${shouldTrackAnalytics()}, initialized: ${isAnalyticsInitialized()}`);
      }
    };

    // Delay page view tracking to ensure analytics is ready
    const timer = setTimeout(trackPageViewDelayed, 500);
    
    return () => clearTimeout(timer);
  }, [location, initialized]);

  // Enhanced tracking functions
  const enhancedTrackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window === 'undefined') return;
    
    if (shouldTrackAnalytics() && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking event: ${eventName}`, parameters);
      trackEvent(eventName, parameters);
    } else {
      console.log(`[Analytics Hook] Skipped tracking event: ${eventName}`);
    }
  };

  const enhancedTrackFormSubmission = (formName: string, success: boolean = true) => {
    if (typeof window === 'undefined') return;
    
    if (shouldTrackAnalytics() && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking form submission: ${formName}, success: ${success}`);
      trackFormSubmission(formName, success);
    } else {
      console.log(`[Analytics Hook] Skipped tracking form: ${formName}`);
    }
  };

  const enhancedTrackButtonClick = (buttonName: string, location?: string) => {
    if (typeof window === 'undefined') return;
    
    if (shouldTrackAnalytics() && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking button click: ${buttonName}`);
      trackButtonClick(buttonName, location);
    } else {
      console.log(`[Analytics Hook] Skipped tracking button: ${buttonName}`);
    }
  };

  const enhancedTrackNavigation = (destination: string, source?: string) => {
    if (typeof window === 'undefined') return;
    
    if (shouldTrackAnalytics() && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking navigation: ${source} → ${destination}`);
      trackNavigation(destination, source);
    } else {
      console.log(`[Analytics Hook] Skipped tracking navigation`);
    }
  };

  const getDebugInfo = () => {
    if (typeof getAnalyticsDebugInfo === 'function') {
      return getAnalyticsDebugInfo();
    }
    return null;
  };

  return {
    trackEvent: enhancedTrackEvent,
    trackFormSubmission: enhancedTrackFormSubmission,
    trackButtonClick: enhancedTrackButtonClick,
    trackNavigation: enhancedTrackNavigation,
    getDebugInfo,
    initialized,
    isProduction: isProduction(),
  };
};
