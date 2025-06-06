
import { useEffect, useState, useRef } from 'react';
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

export const useAnalytics = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);
  const initializationAttempted = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Production environment detection
  const isProduction = () => {
    return window.location.hostname === 'edutchmanagement.nl' || 
           window.location.hostname === 'www.edutchmanagement.nl';
  };

  // Initialize analytics on mount - only once
  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initializationAttempted.current) {
      console.log('[Analytics Hook] Already attempted initialization, skipping');
      return;
    }
    
    initializationAttempted.current = true;
    console.log('[Analytics Hook] Initializing analytics hook (first time)');
    
    // Only initialize in browser environment
    if (typeof window === 'undefined') return;
    
    // For production, use more aggressive initialization
    if (isProduction()) {
      console.log('[Analytics Hook] Production environment detected - forcing initialization');
      
      const initAttempt = () => {
        if (isAnalyticsInitialized()) {
          console.log('[Analytics Hook] Google Analytics ready in production');
          forceInitializeAnalytics();
          setInitialized(true);
        } else {
          console.log('[Analytics Hook] Waiting for Google Analytics in production...');
          timeoutRef.current = setTimeout(initAttempt, 200);
        }
      };
      
      // Start immediately and retry
      initAttempt();
    } else {
      // Development environment - use original logic
      const checkAndInit = () => {
        if (isAnalyticsInitialized()) {
          console.log('[Analytics Hook] Google Analytics is ready, initializing...');
          initializeAnalytics();
          setInitialized(true);
        } else {
          console.log('[Analytics Hook] Google Analytics not ready yet, retrying...');
          timeoutRef.current = setTimeout(checkAndInit, 100);
        }
      };
      
      timeoutRef.current = setTimeout(checkAndInit, 500);
    }

    return () => {
      console.log('[Analytics Hook] Cleaning up analytics hook');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // Empty dependency array - only run once

  // Track page views on route changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const trackPageViewDelayed = () => {
      const shouldTrack = isProduction() || hasAnalyticsConsent();
      
      if (shouldTrack && initialized && isAnalyticsInitialized()) {
        console.log(`[Analytics Hook] Tracking page view: ${location.pathname}`);
        trackPageView(location.pathname + location.search, document.title);
      } else {
        console.log(`[Analytics Hook] Skipping page view - production: ${isProduction()}, consent: ${hasAnalyticsConsent()}, initialized: ${initialized}, gtag ready: ${isAnalyticsInitialized()}`);
      }
    };

    // Shorter delay for production
    const delay = isProduction() ? 500 : 1000;
    const timer = setTimeout(trackPageViewDelayed, delay);
    
    return () => clearTimeout(timer);
  }, [location, initialized]);

  // Enhanced tracking functions with production-aware logging
  const enhancedTrackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window === 'undefined') return;
    
    const shouldTrack = isProduction() || hasAnalyticsConsent();
    
    if (shouldTrack && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking event: ${eventName}`, parameters);
      trackEvent(eventName, parameters);
    } else {
      console.log(`[Analytics Hook] Skipped tracking event: ${eventName} - production: ${isProduction()}, consent: ${hasAnalyticsConsent()}, gtag ready: ${isAnalyticsInitialized()}`);
    }
  };

  const enhancedTrackFormSubmission = (formName: string, success: boolean = true) => {
    if (typeof window === 'undefined') return;
    
    const shouldTrack = isProduction() || hasAnalyticsConsent();
    
    if (shouldTrack && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking form submission: ${formName}, success: ${success}`);
      trackFormSubmission(formName, success);
    } else {
      console.log(`[Analytics Hook] Skipped tracking form: ${formName} - no consent or not initialized`);
    }
  };

  const enhancedTrackButtonClick = (buttonName: string, location?: string) => {
    if (typeof window === 'undefined') return;
    
    const shouldTrack = isProduction() || hasAnalyticsConsent();
    
    if (shouldTrack && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking button click: ${buttonName}`);
      trackButtonClick(buttonName, location);
    } else {
      console.log(`[Analytics Hook] Skipped tracking button: ${buttonName} - no consent or not initialized`);
    }
  };

  const enhancedTrackNavigation = (destination: string, source?: string) => {
    if (typeof window === 'undefined') return;
    
    const shouldTrack = isProduction() || hasAnalyticsConsent();
    
    if (shouldTrack && isAnalyticsInitialized()) {
      console.log(`[Analytics Hook] Tracking navigation: ${source} → ${destination}`);
      trackNavigation(destination, source);
    } else {
      console.log(`[Analytics Hook] Skipped tracking navigation - no consent or not initialized`);
    }
  };

  // Expose debug function for production troubleshooting
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
