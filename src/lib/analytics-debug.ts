
import { hasAnalyticsConsent } from './cookie-utils';
import { isProduction, GA_MEASUREMENT_ID } from './analytics-config';
import { analyticsLog } from './analytics-logger';
import { isGtagReady } from './analytics-script-loader';

// Debug function for production troubleshooting
export const getAnalyticsDebugInfo = () => {
  try {
    const info = {
      environment: isProduction() ? 'production' : 'development',
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
      gtagExists: typeof window !== 'undefined' && typeof window.gtag !== 'undefined',
      gtagReady: isGtagReady(),
      hasConsent: hasAnalyticsConsent(),
      measurementId: GA_MEASUREMENT_ID,
      debugLog: typeof window !== 'undefined' ? (window as any).analyticsDebugLog || [] : []
    };
    
    analyticsLog('Analytics debug info:', info);
    return info;
  } catch (error) {
    analyticsLog('Error getting analytics debug info:', error);
    return {
      environment: 'unknown',
      hostname: 'unknown',
      gtagExists: false,
      gtagReady: false,
      hasConsent: false,
      measurementId: GA_MEASUREMENT_ID,
      debugLog: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Expose debug function globally in production
if (typeof window !== 'undefined' && isProduction()) {
  (window as any).getAnalyticsDebugInfo = getAnalyticsDebugInfo;
  analyticsLog('Analytics debug function exposed globally');
}
