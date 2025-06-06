
import { hasAnalyticsConsent } from './cookie-utils';
import { isProduction, GA_MEASUREMENT_ID } from './analytics-config';
import { analyticsLog } from './analytics-logger';
import { isGtagReady } from './analytics-script-loader';

// Debug function for production troubleshooting
export const getAnalyticsDebugInfo = () => {
  const info = {
    environment: isProduction() ? 'production' : 'development',
    hostname: window.location.hostname,
    gtagExists: typeof window.gtag !== 'undefined',
    gtagReady: isGtagReady(),
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
