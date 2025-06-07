
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

// Enhanced tracking permission check with fallback logic
export const shouldTrackAnalytics = (): boolean => {
  // In production, check for explicit consent OR assume consent through website usage
  if (isProduction()) {
    const hasExplicitConsent = hasAnalyticsConsent();
    console.log(`[Analytics Consent] Production - explicit consent: ${hasExplicitConsent}`);
    
    // Fallback: if no explicit consent cookie exists, assume consent in production
    if (hasExplicitConsent === null || hasExplicitConsent === undefined) {
      console.log('[Analytics Consent] Production - no explicit consent found, assuming consent');
      return true;
    }
    
    return hasExplicitConsent;
  }
  
  // In development, require explicit consent
  const devConsent = hasAnalyticsConsent();
  console.log(`[Analytics Consent] Development - consent required: ${devConsent}`);
  return devConsent;
};

// Real-time consent status with caching
let consentCache: boolean | null = null;
let lastConsentCheck = 0;
const CACHE_DURATION = 1000; // 1 second cache

export const shouldTrackAnalyticsRealtime = (): boolean => {
  const now = Date.now();
  
  // Use cache if it's fresh
  if (consentCache !== null && (now - lastConsentCheck) < CACHE_DURATION) {
    return consentCache;
  }
  
  // Refresh cache
  consentCache = shouldTrackAnalytics();
  lastConsentCheck = now;
  
  return consentCache;
};

// Clear consent cache when cookies change
if (typeof window !== 'undefined') {
  window.addEventListener('cookieChange', () => {
    console.log('[Analytics Consent] Cookie change detected, clearing cache');
    consentCache = null;
  });
}
