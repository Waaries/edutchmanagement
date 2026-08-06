
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
import { isProduction } from '@/lib/analytics-config';
import { shouldTrackAnalytics, shouldTrackAnalyticsRealtime } from '@/lib/analytics-consent';
import { devLog } from "@/lib/logger";

// Global flag to prevent multiple initializations
let globalAnalyticsInitialized = false;

export const useAnalytics = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);
  const [consentStatus, setConsentStatus] = useState<boolean | null>(null);
  const initRef = useRef(false);

  // Listen for cookie changes to update consent status
  useEffect(() => {
    const handleCookieChange = () => {
      const newConsentStatus = hasAnalyticsConsent();
      devLog('[Analytics Hook] Cookie change detected, consent status:', newConsentStatus);
      setConsentStatus(newConsentStatus);
    };

    // Initial consent status
    setConsentStatus(hasAnalyticsConsent());

    // Listen for cookie changes
    window.addEventListener('cookieChange', handleCookieChange);
    
    return () => {
      window.removeEventListener('cookieChange', handleCookieChange);
    };
  }, []);

  // Initialize analytics only once globally
  useEffect(() => {
    if (initRef.current || globalAnalyticsInitialized) return;
    
    initRef.current = true;
    devLog('[Analytics Hook] Initializing analytics hook');
    
    // Only initialize in browser environment
    if (typeof window === 'undefined') return;
    
    const initAnalytics = async () => {
      try {
        globalAnalyticsInitialized = true;
        
        if (isProduction()) {
          devLog('[Analytics Hook] Production environment detected');
          await forceInitializeAnalytics();
        } else {
          devLog('[Analytics Hook] Development environment');
          await initializeAnalytics();
        }
        setInitialized(true);
      } catch (error) {
        console.error('[Analytics Hook] Failed to initialize analytics:', error);
        globalAnalyticsInitialized = false;
      }
    };

    // Start initialization with a small delay to ensure DOM is ready
    setTimeout(initAnalytics, 100);

    return () => {
      devLog('[Analytics Hook] Cleaning up analytics hook');
    };
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (typeof window === 'undefined' || !initialized) return;
    
    const trackPageViewDelayed = () => {
      const shouldTrack = shouldTrackAnalyticsRealtime();
      const analyticsReady = isAnalyticsInitialized();
      
      if (shouldTrack && analyticsReady) {
        devLog(`[Analytics Hook] Tracking page view: ${location.pathname}`);
        trackPageView(location.pathname + location.search, document.title);
      } else {
        devLog(`[Analytics Hook] Skipping page view - should track: ${shouldTrack}, initialized: ${analyticsReady}`);
      }
    };

    // Delay page view tracking to ensure analytics is ready
    const timer = setTimeout(trackPageViewDelayed, 500);
    
    return () => clearTimeout(timer);
  }, [location, initialized, consentStatus]);

  // Enhanced tracking functions with real-time consent checking
  const enhancedTrackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window === 'undefined') return;
    
    if (shouldTrackAnalyticsRealtime() && isAnalyticsInitialized()) {
      trackEvent(eventName, parameters);
    }
  };

  const enhancedTrackFormSubmission = (formName: string, success: boolean = true) => {
    if (typeof window === 'undefined') return;
    
    if (shouldTrackAnalyticsRealtime() && isAnalyticsInitialized()) {
      trackFormSubmission(formName, success);
    }
  };

  const enhancedTrackButtonClick = (buttonName: string, location?: string) => {
    if (typeof window === 'undefined') return;
    
    if (shouldTrackAnalyticsRealtime() && isAnalyticsInitialized()) {
      trackButtonClick(buttonName, location);
    }
  };

  const enhancedTrackNavigation = (destination: string, source?: string) => {
    if (typeof window === 'undefined') return;
    
    if (shouldTrackAnalyticsRealtime() && isAnalyticsInitialized()) {
      trackNavigation(destination, source);
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
    consentStatus,
    isProduction: isProduction(),
  };
};
