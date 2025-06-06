import { getCookie, hasAnalyticsConsent } from './cookie-utils';

// Google Analytics configuration
const GA_MEASUREMENT_ID = 'G-5X70ML3RM6';

// Track if analytics is initialized
let analyticsInitialized = false;

// Production environment detection
const isProduction = () => {
  return window.location.hostname === 'edutchmanagement.nl' || 
         window.location.hostname === 'www.edutchmanagement.nl';
};

// Enhanced logging for production debugging
const analyticsLog = (message: string, data?: any) => {
  const prefix = isProduction() ? '[PROD Analytics]' : '[DEV Analytics]';
  console.log(prefix, message, data || '');
  
  // In production, also log to a global debug array for inspection
  if (isProduction() && typeof window !== 'undefined') {
    if (!(window as any).analyticsDebugLog) {
      (window as any).analyticsDebugLog = [];
    }
    (window as any).analyticsDebugLog.push({
      timestamp: new Date().toISOString(),
      message,
      data: data || null,
      url: window.location.href
    });
    
    // Keep only last 50 entries
    if ((window as any).analyticsDebugLog.length > 50) {
      (window as any).analyticsDebugLog = (window as any).analyticsDebugLog.slice(-50);
    }
  }
};

// Check if analytics is initialized
export const isAnalyticsInitialized = (): boolean => {
  const gtagReady = typeof window !== 'undefined' && 
                   typeof window.gtag !== 'undefined' && 
                   (window as any).gtagReady === true;
  
  analyticsLog(`Analytics initialization check - gtag ready: ${gtagReady}`);
  return gtagReady;
};

// Force analytics initialization for production
export const forceInitializeAnalytics = () => {
  analyticsLog('Force initializing analytics...');
  
  if (typeof window === 'undefined') {
    analyticsLog('Not in browser environment, skipping');
    return;
  }

  // Check if gtag script is loaded
  if (typeof window.gtag === 'undefined') {
    analyticsLog('ERROR: gtag not loaded - checking script tags');
    const scripts = Array.from(document.getElementsByTagName('script'));
    const gtagScript = scripts.find(s => s.src?.includes('googletagmanager.com/gtag'));
    analyticsLog('Google Analytics script found:', !!gtagScript);
    
    if (!gtagScript) {
      analyticsLog('CRITICAL: Google Analytics script not found in DOM');
      // Try to load the script dynamically
      loadGoogleAnalytics();
    }
    return;
  }

  // Force enable analytics regardless of consent for testing
  if (isProduction()) {
    analyticsLog('Production environment - enabling analytics');
    enableAnalytics();
  } else if (hasAnalyticsConsent()) {
    analyticsLog('Development environment with consent - enabling analytics');
    enableAnalytics();
  } else {
    analyticsLog('Development environment without consent - disabling analytics');
    disableAnalytics();
  }

  analyticsInitialized = true;
  
  // Force initial page view
  if (typeof window !== 'undefined' && window.location) {
    const path = window.location.pathname + window.location.search;
    analyticsLog(`Tracking initial page view: ${path}`);
    trackPageView(path, document.title);
  }
};

// Dynamically load Google Analytics if missing
const loadGoogleAnalytics = () => {
  analyticsLog('Dynamically loading Google Analytics script...');
  
  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  
  // Initialize gtag when script loads
  script.onload = () => {
    analyticsLog('Google Analytics script loaded dynamically');
    
    // Initialize dataLayer and gtag function
    (window as any).dataLayer = (window as any).dataLayer || [];
    window.gtag = function() {
      (window as any).dataLayer.push(arguments);
    };
    
    window.gtag('js', new Date());
    window.gtag('consent', 'default', {
      'analytics_storage': 'denied'
    });
    
    window.gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=Strict;Secure'
    });
    
    (window as any).gtagReady = true;
    analyticsLog('Google Analytics initialized dynamically');
    
    // Try to initialize again
    setTimeout(() => forceInitializeAnalytics(), 100);
  };
};

// Initialize Google Analytics
export const initializeAnalytics = () => {
  analyticsLog('Initializing analytics...');
  
  if (typeof window === 'undefined') {
    analyticsLog('Not in browser environment, skipping initialization');
    return;
  }

  if (!isAnalyticsInitialized()) {
    analyticsLog('Google Analytics not yet loaded, forcing initialization...');
    forceInitializeAnalytics();
    return;
  }

  // In production, always enable analytics
  if (isProduction()) {
    analyticsLog('Production environment - enabling analytics without consent check');
    enableAnalytics();
    analyticsInitialized = true;
    return;
  }

  // In development, check consent
  if (!hasAnalyticsConsent()) {
    analyticsLog('Analytics consent not granted, disabling analytics');
    disableAnalytics();
    return;
  }

  analyticsLog('Enabling Google Analytics with consent');
  enableAnalytics();
  analyticsInitialized = true;

  // Force initial page view
  if (typeof window !== 'undefined' && window.location) {
    trackPageView(window.location.pathname + window.location.search, document.title);
  }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined') {
    analyticsLog('Skipping page view tracking - not in browser');
    return;
  }
  
  // In production, always track regardless of consent
  const shouldTrack = isProduction() || hasAnalyticsConsent();
  
  if (!shouldTrack || !isAnalyticsInitialized()) {
    analyticsLog(`Skipping page view tracking for ${path} - should track: ${shouldTrack}, initialized: ${isAnalyticsInitialized()}`);
    return;
  }

  try {
    // Send page view to Google Analytics
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
      custom_map: {
        'dimension1': 'page_view'
      }
    });

    // Also send as an event for better tracking
    window.gtag('event', 'page_view', {
      page_title: title,
      page_location: window.location.href,
      page_path: path,
      send_to: GA_MEASUREMENT_ID
    });
    
    analyticsLog(`Page view tracked: ${path}`, {
      title,
      location: window.location.href,
      measurementId: GA_MEASUREMENT_ID
    });
  } catch (error) {
    analyticsLog(`Error tracking page view for ${path}:`, error);
  }
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window === 'undefined') {
    analyticsLog('Skipping event tracking - not in browser');
    return;
  }
  
  const shouldTrack = isProduction() || hasAnalyticsConsent();
  
  if (!shouldTrack || !isAnalyticsInitialized()) {
    analyticsLog(`Skipping event tracking for ${eventName}`);
    return;
  }

  try {
    window.gtag('event', eventName, {
      event_category: 'engagement',
      send_to: GA_MEASUREMENT_ID,
      ...parameters,
    });
    analyticsLog(`Event tracked: ${eventName}`, parameters);
  } catch (error) {
    analyticsLog(`Error tracking event ${eventName}:`, error);
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
  if (typeof window !== 'undefined' && isAnalyticsInitialized()) {
    try {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
      analyticsLog('Google Analytics disabled');
    } catch (error) {
      analyticsLog('Error disabling analytics:', error);
    }
  }
  analyticsInitialized = false;
};

// Enable analytics (for consent granting)
export const enableAnalytics = () => {
  if (typeof window !== 'undefined' && isAnalyticsInitialized()) {
    try {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
      
      // Initialize configuration
      window.gtag('config', GA_MEASUREMENT_ID, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=Strict;Secure',
        send_page_view: true
      });
      
      analyticsLog('Google Analytics enabled');
    } catch (error) {
      analyticsLog('Error enabling analytics:', error);
    }
  }
  analyticsInitialized = true;
};

// Debug function for production troubleshooting
export const getAnalyticsDebugInfo = () => {
  const info = {
    environment: isProduction() ? 'production' : 'development',
    hostname: window.location.hostname,
    gtagExists: typeof window.gtag !== 'undefined',
    gtagReady: (window as any).gtagReady === true,
    analyticsInitialized,
    hasConsent: hasAnalyticsConsent(),
    measurementId: GA_MEASUREMENT_ID,
    debugLog: (window as any).analyticsDebugLog || []
  };
  
  analyticsLog('Analytics debug info:', info);
  return info;
};

// Expose debug function globally in production
if (typeof window !== 'undefined' && isProduction()) {
  (window as any).getAnalyticsDebugInfo = getAnalyticsDebugInfo;
  analyticsLog('Analytics debug function exposed globally');
}
