
import { hasAnalyticsConsent } from './cookie-utils';
import { isProduction } from './analytics-config';
import { GA_MEASUREMENT_ID } from './analytics-config';
import { analyticsLog } from './analytics-logger';
import { isGtagReady } from './analytics-script-loader';

// Enable analytics with proper consent handling
export const enableAnalytics = () => {
  if (typeof window === 'undefined' || !isGtagReady()) {
    analyticsLog('Cannot enable analytics - gtag not ready');
    return;
  }

  try {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
    });
    
    // Configure Google Analytics
    window.gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=Strict;Secure',
      send_page_view: false // We handle page views manually
    });
    
    analyticsLog('Google Analytics enabled and configured');
  } catch (error) {
    analyticsLog('Error enabling analytics:', error);
  }
};

// Disable analytics
export const disableAnalytics = () => {
  if (typeof window !== 'undefined' && isGtagReady()) {
    try {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
      analyticsLog('Google Analytics disabled');
    } catch (error) {
      analyticsLog('Error disabling analytics:', error);
    }
  }
};

// Check if tracking should be enabled
export const shouldTrackAnalytics = (): boolean => {
  // In production, always track (assuming consent through website usage)
  if (isProduction()) {
    return true;
  }
  
  // In development, only track with explicit consent
  return hasAnalyticsConsent();
};
