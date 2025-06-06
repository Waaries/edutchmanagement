
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  initializeAnalytics, 
  trackPageView, 
  trackEvent, 
  trackFormSubmission, 
  trackButtonClick, 
  trackNavigation,
  isAnalyticsInitialized
} from '@/lib/analytics';
import { hasAnalyticsConsent } from '@/lib/cookie-utils';

export const useAnalytics = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  // Initialize analytics on mount
  useEffect(() => {
    console.log('[Analytics Hook] Initializing analytics hook');
    
    // Check if Google Analytics is ready
    const checkAndInit = () => {
      if (isAnalyticsInitialized()) {
        console.log('[Analytics Hook] Google Analytics is ready, initializing...');
        initializeAnalytics();
        setInitialized(true);
      } else {
        console.log('[Analytics Hook] Google Analytics not ready yet, retrying...');
        setTimeout(checkAndInit, 100);
      }
    };
    
    checkAndInit();

    return () => {
      console.log('[Analytics Hook] Cleaning up analytics hook');
    };
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (hasAnalyticsConsent() && initialized && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking page view: ${location.pathname}`);
      trackPageView(location.pathname + location.search, document.title);
    } else {
      console.log(`[Analytics Hook] Skipping page view - consent: ${hasAnalyticsConsent()}, initialized: ${initialized}, gtag ready: ${isAnalyticsInitialized()}`);
    }
  }, [location, initialized]);

  // Enhanced tracking functions with logging
  const enhancedTrackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (hasAnalyticsConsent() && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking event: ${eventName}`, parameters);
      trackEvent(eventName, parameters);
    } else {
      console.log(`[Analytics Hook] Skipped tracking event: ${eventName} - no consent or not initialized`);
    }
  };

  const enhancedTrackFormSubmission = (formName: string, success: boolean = true) => {
    if (hasAnalyticsConsent() && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking form submission: ${formName}, success: ${success}`);
      trackFormSubmission(formName, success);
    } else {
      console.log(`[Analytics Hook] Skipped tracking form: ${formName} - no consent or not initialized`);
    }
  };

  const enhancedTrackButtonClick = (buttonName: string, location?: string) => {
    if (hasAnalyticsConsent() && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking button click: ${buttonName}`);
      trackButtonClick(buttonName, location);
    } else {
      console.log(`[Analytics Hook] Skipped tracking button: ${buttonName} - no consent or not initialized`);
    }
  };

  const enhancedTrackNavigation = (destination: string, source?: string) => {
    if (hasAnalyticsConsent() && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking navigation: ${source} → ${destination}`);
      trackNavigation(destination, source);
    } else {
      console.log(`[Analytics Hook] Skipped tracking navigation - no consent or not initialized`);
    }
  };

  return {
    trackEvent: enhancedTrackEvent,
    trackFormSubmission: enhancedTrackFormSubmission,
    trackButtonClick: enhancedTrackButtonClick,
    trackNavigation: enhancedTrackNavigation,
    initialized,
  };
};
