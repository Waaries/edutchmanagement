
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
    
    // Only initialize in browser environment
    if (typeof window === 'undefined') return;
    
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
    
    // Wait a bit for the script to load
    setTimeout(checkAndInit, 500);

    return () => {
      console.log('[Analytics Hook] Cleaning up analytics hook');
    };
  }, []);

  // Track page views on route changes with a delay to ensure DOM is ready
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Add delay to ensure page is fully loaded
    const trackPageViewDelayed = () => {
      if (hasAnalyticsConsent() && initialized && isAnalyticsInitialized()) {
        console.log(`[Analytics Hook] Tracking page view: ${location.pathname}`);
        trackPageView(location.pathname + location.search, document.title);
      } else {
        console.log(`[Analytics Hook] Skipping page view - consent: ${hasAnalyticsConsent()}, initialized: ${initialized}, gtag ready: ${isAnalyticsInitialized()}`);
      }
    };

    // Wait for DOM to be ready
    const timer = setTimeout(trackPageViewDelayed, 1000);
    
    return () => clearTimeout(timer);
  }, [location, initialized]);

  // Enhanced tracking functions with logging
  const enhancedTrackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window === 'undefined') return;
    
    if (hasAnalyticsConsent() && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking event: ${eventName}`, parameters);
      trackEvent(eventName, parameters);
    } else {
      console.log(`[Analytics Hook] Skipped tracking event: ${eventName} - no consent or not initialized`);
    }
  };

  const enhancedTrackFormSubmission = (formName: string, success: boolean = true) => {
    if (typeof window === 'undefined') return;
    
    if (hasAnalyticsConsent() && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking form submission: ${formName}, success: ${success}`);
      trackFormSubmission(formName, success);
    } else {
      console.log(`[Analytics Hook] Skipped tracking form: ${formName} - no consent or not initialized`);
    }
  };

  const enhancedTrackButtonClick = (buttonName: string, location?: string) => {
    if (typeof window === 'undefined') return;
    
    if (hasAnalyticsConsent() && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking button click: ${buttonName}`);
      trackButtonClick(buttonName, location);
    } else {
      console.log(`[Analytics Hook] Skipped tracking button: ${buttonName} - no consent or not initialized`);
    }
  };

  const enhancedTrackNavigation = (destination: string, source?: string) => {
    if (typeof window === 'undefined') return;
    
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
