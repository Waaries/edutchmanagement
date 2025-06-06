
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

  // Initialize analytics on mount if consent is given
  useEffect(() => {
    const hasConsent = hasAnalyticsConsent();
    console.log('[Analytics] Checking analytics consent:', hasConsent);
    
    if (hasConsent) {
      console.log('[Analytics] Initializing analytics');
      initializeAnalytics();
      setInitialized(true);
    } else {
      console.log('[Analytics] Skipping analytics initialization - no consent');
    }

    return () => {
      console.log('[Analytics] Cleaning up analytics hook');
    };
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (hasAnalyticsConsent() && initialized) {
      console.log(`[Analytics] Tracking page view: ${location.pathname}`);
      trackPageView(location.pathname + location.search, document.title);
    }
  }, [location, initialized]);

  // Enhanced tracking functions with logging
  const enhancedTrackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (hasAnalyticsConsent() && isAnalyticsInitialized()) {
      console.log(`[Analytics] Tracking event: ${eventName}`, parameters);
      trackEvent(eventName, parameters);
    } else {
      console.log(`[Analytics] Skipped tracking event: ${eventName} - no consent or not initialized`);
    }
  };

  const enhancedTrackFormSubmission = (formName: string, success: boolean = true) => {
    if (hasAnalyticsConsent() && isAnalyticsInitialized()) {
      console.log(`[Analytics] Tracking form submission: ${formName}, success: ${success}`);
      trackFormSubmission(formName, success);
    } else {
      console.log(`[Analytics] Skipped tracking form: ${formName} - no consent or not initialized`);
    }
  };

  const enhancedTrackButtonClick = (buttonName: string, location?: string) => {
    if (hasAnalyticsConsent() && isAnalyticsInitialized()) {
      console.log(`[Analytics] Tracking button click: ${buttonName}`);
      trackButtonClick(buttonName, location);
    } else {
      console.log(`[Analytics] Skipped tracking button: ${buttonName} - no consent or not initialized`);
    }
  };

  const enhancedTrackNavigation = (destination: string, source?: string) => {
    if (hasAnalyticsConsent() && isAnalyticsInitialized()) {
      console.log(`[Analytics] Tracking navigation: ${source} → ${destination}`);
      trackNavigation(destination, source);
    } else {
      console.log(`[Analytics] Skipped tracking navigation - no consent or not initialized`);
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
