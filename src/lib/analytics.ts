
import { getCookie, hasAnalyticsConsent } from './cookie-utils';

// Google Analytics configuration
const GA_MEASUREMENT_ID = 'G-5X70ML3RM6';

// Track if analytics is initialized
let analyticsInitialized = false;

// Check if analytics is initialized
export const isAnalyticsInitialized = (): boolean => {
  return typeof window.gtag !== 'undefined' && (window as any).gtagReady === true;
};

// Initialize Google Analytics
export const initializeAnalytics = () => {
  console.log('[Analytics] Initializing analytics...');
  
  if (!isAnalyticsInitialized()) {
    console.log('[Analytics] Google Analytics not yet loaded, waiting...');
    // Wait for gtag to be ready
    const checkGtag = () => {
      if (isAnalyticsInitialized()) {
        initializeAnalytics();
      } else {
        setTimeout(checkGtag, 100);
      }
    };
    setTimeout(checkGtag, 100);
    return;
  }

  if (!hasAnalyticsConsent()) {
    console.log('[Analytics] Analytics consent not granted, disabling analytics');
    disableAnalytics();
    return;
  }

  console.log('[Analytics] Enabling Google Analytics with consent');
  enableAnalytics();
  analyticsInitialized = true;
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (!hasAnalyticsConsent() || !isAnalyticsInitialized()) {
    console.log(`[Analytics] Skipping page view tracking for ${path} - consent: ${hasAnalyticsConsent()}, initialized: ${isAnalyticsInitialized()}`);
    return;
  }

  try {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
    });
    console.log(`[Analytics] Page view tracked: ${path}`);
  } catch (error) {
    console.error(`[Analytics] Error tracking page view for ${path}:`, error);
  }
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (!hasAnalyticsConsent() || !isAnalyticsInitialized()) {
    console.log(`[Analytics] Skipping event tracking for ${eventName}`);
    return;
  }

  try {
    window.gtag('event', eventName, {
      event_category: 'engagement',
      ...parameters,
    });
    console.log(`[Analytics] Event tracked: ${eventName}`, parameters);
  } catch (error) {
    console.error(`[Analytics] Error tracking event ${eventName}:`, error);
  }
};

// Track form submissions
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  trackEvent('form_submit', {
    form_name: formName,
    success: success,
    event_category: 'form',
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    click_location: location,
    event_category: 'interaction',
  });
};

// Track navigation
export const trackNavigation = (destination: string, source?: string) => {
  trackEvent('navigation', {
    destination: destination,
    source: source,
    event_category: 'navigation',
  });
};

// Disable analytics (for consent withdrawal)
export const disableAnalytics = () => {
  if (isAnalyticsInitialized()) {
    try {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
      console.log('[Analytics] Google Analytics disabled');
    } catch (error) {
      console.error('[Analytics] Error disabling analytics:', error);
    }
  }
  analyticsInitialized = false;
};

// Enable analytics (for consent granting)
export const enableAnalytics = () => {
  if (isAnalyticsInitialized()) {
    try {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
      console.log('[Analytics] Google Analytics enabled');
    } catch (error) {
      console.error('[Analytics] Error enabling analytics:', error);
    }
  }
  analyticsInitialized = true;
};
