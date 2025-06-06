
import { loadGoogleAnalyticsScript, isGtagReady } from './analytics-script-loader';
import { enableAnalytics, disableAnalytics, shouldTrackAnalytics } from './analytics-consent';
import { trackPageView, trackEvent, trackFormSubmission, trackButtonClick, trackNavigation } from './analytics-tracking';
import { getAnalyticsDebugInfo } from './analytics-debug';
import { analyticsLog } from './analytics-logger';
import { GA_MEASUREMENT_ID } from './analytics-config';

// Track if analytics is initialized
let analyticsInitialized = false;

// Check if analytics is initialized
export const isAnalyticsInitialized = (): boolean => {
  return analyticsInitialized && isGtagReady();
};

// Initialize Google Analytics
export const initializeAnalytics = async () => {
  analyticsLog('Initializing analytics...');
  
  if (typeof window === 'undefined') {
    analyticsLog('Not in browser environment, skipping initialization');
    return;
  }

  if (analyticsInitialized) {
    analyticsLog('Analytics already initialized');
    return;
  }

  try {
    // Load the script first
    const scriptLoaded = await loadGoogleAnalyticsScript();
    if (!scriptLoaded) {
      analyticsLog('Failed to load Google Analytics script');
      return;
    }

    // Initialize gtag with default settings
    window.gtag('js', new Date());
    window.gtag('consent', 'default', {
      'analytics_storage': 'denied'
    });

    // Configure with basic settings
    window.gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=Strict;Secure',
      send_page_view: false
    });

    analyticsInitialized = true;
    analyticsLog('Analytics base initialization complete');

    // Enable or disable based on consent
    if (shouldTrackAnalytics()) {
      enableAnalytics();
      // Track initial page view
      if (window.location) {
        trackPageView(window.location.pathname + window.location.search, document.title);
      }
    } else {
      disableAnalytics();
    }

  } catch (error) {
    analyticsLog('Error during analytics initialization:', error);
  }
};

// Force initialization for production environments
export const forceInitializeAnalytics = async () => {
  analyticsLog('Force initializing analytics...');
  analyticsInitialized = false; // Reset flag
  await initializeAnalytics();
};

// Re-export all tracking functions and utilities
export {
  trackPageView,
  trackEvent,
  trackFormSubmission,
  trackButtonClick,
  trackNavigation,
  enableAnalytics,
  disableAnalytics,
  getAnalyticsDebugInfo
};
