
import { GA_MEASUREMENT_ID } from './analytics-config';
import { analyticsLog } from './analytics-logger';
import { isGtagReady } from './analytics-script-loader';
import { shouldTrackAnalytics } from './analytics-consent';

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined') {
    analyticsLog('Skipping page view tracking - not in browser');
    return;
  }
  
  if (!shouldTrackAnalytics() || !isGtagReady()) {
    analyticsLog(`Skipping page view tracking for ${path} - should track: ${shouldTrackAnalytics()}, gtag ready: ${isGtagReady()}`);
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
  
  if (!shouldTrackAnalytics() || !isGtagReady()) {
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
