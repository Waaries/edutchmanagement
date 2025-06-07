
import { hasAnalyticsConsent, getConsentStatus, getAllCookies, debugCookies } from './cookie-utils';
import { isProduction, GA_MEASUREMENT_ID } from './analytics-config';
import { analyticsLog } from './analytics-logger';
import { isGtagReady } from './analytics-script-loader';
import { shouldTrackAnalytics, shouldTrackAnalyticsRealtime } from './analytics-consent';

// Enhanced debug function for production troubleshooting
export const getAnalyticsDebugInfo = () => {
  try {
    // Get detailed cookie information
    const cookieDebugInfo = debugCookies();
    
    const info = {
      environment: isProduction() ? 'production' : 'development',
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
      gtagExists: typeof window !== 'undefined' && typeof window.gtag !== 'undefined',
      gtagReady: isGtagReady(),
      hasConsent: hasAnalyticsConsent(),
      consentStatus: getConsentStatus(),
      shouldTrack: shouldTrackAnalytics(),
      shouldTrackRealtime: shouldTrackAnalyticsRealtime(),
      measurementId: GA_MEASUREMENT_ID,
      debugLog: typeof window !== 'undefined' ? (window as any).analyticsDebugLog || [] : [],
      cookies: {
        all: cookieDebugInfo.allCookies,
        rawCookies: cookieDebugInfo.rawCookies,
        consentCookie: cookieDebugInfo.allCookies.cookieConsent || null,
        analyticsEnabledCookie: cookieDebugInfo.allCookies.analyticsEnabled || null,
        timestampCookie: cookieDebugInfo.allCookies.cookieConsentTimestamp || null
      },
      timestamp: new Date().toISOString()
    };
    
    analyticsLog('Analytics debug info generated:', info);
    return info;
  } catch (error) {
    analyticsLog('Error getting analytics debug info:', error);
    return {
      environment: 'unknown',
      hostname: 'unknown',
      gtagExists: false,
      gtagReady: false,
      hasConsent: false,
      consentStatus: null,
      shouldTrack: false,
      shouldTrackRealtime: false,
      measurementId: GA_MEASUREMENT_ID,
      debugLog: [],
      cookies: { all: {}, rawCookies: '', consentCookie: null, analyticsEnabledCookie: null, timestampCookie: null },
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
};

// Expose debug function globally in production
if (typeof window !== 'undefined' && isProduction()) {
  (window as any).getAnalyticsDebugInfo = getAnalyticsDebugInfo;
  analyticsLog('Analytics debug function exposed globally');
}
