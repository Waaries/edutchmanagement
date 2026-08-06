
import { hasAnalyticsConsent } from './cookie-utils';
import { isProduction } from './analytics-config';
import { GA_MEASUREMENT_ID } from './analytics-config';
import { analyticsLog } from './analytics-logger';
import { isGtagReady } from './analytics-script-loader';
import { devLog } from "@/lib/logger";

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
      cookie_flags: 'SameSite=Lax;Secure',
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

// Enhanced tracking permission check with improved fallback logic
export const shouldTrackAnalytics = (): boolean => {
  try {
    const hasExplicitConsent = hasAnalyticsConsent();
    
    // In production, check for explicit consent
    if (isProduction()) {
      devLog(`[Analytics Consent] Production - explicit consent: ${hasExplicitConsent}`);
      return hasExplicitConsent;
    }
    
    // In development, require explicit consent
    devLog(`[Analytics Consent] Development - consent required: ${hasExplicitConsent}`);
    return hasExplicitConsent;
  } catch (error) {
    console.error('[Analytics Consent] Error checking consent:', error);
    return false;
  }
};

// Real-time consent status with improved caching
let consentCache: boolean | null = null;
let lastConsentCheck = 0;
const CACHE_DURATION = 500; // Reduced cache duration for more responsive updates

export const shouldTrackAnalyticsRealtime = (): boolean => {
  const now = Date.now();
  
  // Use cache if it's fresh
  if (consentCache !== null && (now - lastConsentCheck) < CACHE_DURATION) {
    return consentCache;
  }
  
  // Refresh cache
  const newConsent = shouldTrackAnalytics();
  
  // Log cache updates for debugging
  if (consentCache !== newConsent) {
    devLog(`[Analytics Consent] Cache updated: ${consentCache} -> ${newConsent}`);
  }
  
  consentCache = newConsent;
  lastConsentCheck = now;
  
  return consentCache;
};

// Clear consent cache when cookies change
if (typeof window !== 'undefined') {
  window.addEventListener('cookieChange', (event) => {
    const detail = (event as CustomEvent).detail;
    devLog(`[Analytics Consent] Cookie change detected: ${detail?.name}, clearing cache`);
    consentCache = null;
    lastConsentCheck = 0;
  });
}
