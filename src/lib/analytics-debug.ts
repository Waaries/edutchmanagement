
import { hasAnalyticsConsent, getConsentStatus, getAllCookies, debugCookies } from './cookie-utils';
import { isProduction, GA_MEASUREMENT_ID } from './analytics-config';
import { analyticsLog } from './analytics-logger';
import { isGtagReady } from './analytics-script-loader';
import { shouldTrackAnalytics, shouldTrackAnalyticsRealtime } from './analytics-consent';

// Detect environment details
const getEnvironmentInfo = () => {
  const isIframe = (() => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  })();
  
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
  
  const isLovable = window.location.hostname.includes('lovable.app') ||
                   window.location.hostname.includes('gptengineer.app');
  
  return {
    isIframe,
    isLocalhost,
    isLovable,
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    userAgent: navigator.userAgent.substring(0, 100)
  };
};

// Enhanced debug function for production troubleshooting
export const getAnalyticsDebugInfo = () => {
  try {
    // Get detailed cookie information
    const cookieDebugInfo = debugCookies();
    const envInfo = getEnvironmentInfo();
    
    // Test cookie functionality
    const testCookieName = 'debug_test_' + Date.now();
    const testCookieValue = 'test_value_' + Math.random();
    
    // Try to set and read a test cookie
    document.cookie = `${testCookieName}=${testCookieValue}; path=/; SameSite=Lax`;
    const testCookieRead = document.cookie.split(';')
      .find(c => c.trim().startsWith(testCookieName + '='))
      ?.split('=')[1];
    
    // Clean up test cookie
    document.cookie = `${testCookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    
    const cookieTestPassed = testCookieRead === testCookieValue;
    
    // Check fallback storage availability
    let fallbackStorageWorks = false;
    try {
      localStorage.setItem('test_fallback', 'test');
      fallbackStorageWorks = localStorage.getItem('test_fallback') === 'test';
      localStorage.removeItem('test_fallback');
    } catch (e) {
      fallbackStorageWorks = false;
    }
    
    const info = {
      environment: isProduction() ? 'production' : 'development',
      environmentDetails: envInfo,
      gtagExists: typeof window !== 'undefined' && typeof window.gtag !== 'undefined',
      gtagReady: isGtagReady(),
      hasConsent: hasAnalyticsConsent(),
      consentStatus: getConsentStatus(),
      shouldTrack: shouldTrackAnalytics(),
      shouldTrackRealtime: shouldTrackAnalyticsRealtime(),
      measurementId: GA_MEASUREMENT_ID,
      debugLog: typeof window !== 'undefined' ? (window as any).analyticsDebugLog || [] : [],
      cookieTest: {
        passed: cookieTestPassed,
        testName: testCookieName,
        expectedValue: testCookieValue,
        actualValue: testCookieRead
      },
      fallbackStorage: {
        available: fallbackStorageWorks,
        needed: envInfo.isIframe || envInfo.isLovable
      },
      cookies: {
        all: cookieDebugInfo.allCookies,
        rawCookies: cookieDebugInfo.rawCookies,
        consentCookie: cookieDebugInfo.allCookies.cookieConsent || null,
        analyticsEnabledCookie: cookieDebugInfo.allCookies.analyticsEnabled || null,
        timestampCookie: cookieDebugInfo.allCookies.cookieConsentTimestamp || null,
        isIframe: cookieDebugInfo.isIframe,
        fallbackAvailable: cookieDebugInfo.fallbackAvailable
      },
      timestamp: new Date().toISOString()
    };
    
    analyticsLog('Analytics debug info generated:', info);
    return info;
  } catch (error) {
    analyticsLog('Error getting analytics debug info:', error);
    return {
      environment: 'unknown',
      environmentDetails: { isIframe: false, isLocalhost: false, isLovable: false, hostname: 'unknown', protocol: 'unknown', userAgent: 'unknown' },
      gtagExists: false,
      gtagReady: false,
      hasConsent: false,
      consentStatus: null,
      shouldTrack: false,
      shouldTrackRealtime: false,
      measurementId: GA_MEASUREMENT_ID,
      debugLog: [],
      cookieTest: { passed: false, testName: '', expectedValue: '', actualValue: null },
      fallbackStorage: { available: false, needed: false },
      cookies: { all: {}, rawCookies: '', consentCookie: null, analyticsEnabledCookie: null, timestampCookie: null, isIframe: false, fallbackAvailable: false },
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
};

// Expose debug function globally in all environments for troubleshooting
if (typeof window !== 'undefined') {
  (window as any).getAnalyticsDebugInfo = getAnalyticsDebugInfo;
  
  // Add helper to force consent for testing
  (window as any).forceConsentForTesting = (consentType: 'all' | 'essential' = 'all') => {
    console.log(`[Analytics Debug] Forcing consent for testing: ${consentType}`);
    
    // Use the fallback storage directly for testing
    if (consentType === 'all') {
      localStorage.setItem('cookie_fallback_cookieConsent', 'all');
      localStorage.setItem('cookie_fallback_analyticsEnabled', 'true');
    } else {
      localStorage.setItem('cookie_fallback_cookieConsent', 'essential');
      localStorage.removeItem('cookie_fallback_analyticsEnabled');
    }
    
    // Trigger update events
    window.dispatchEvent(new CustomEvent('cookieChange', { 
      detail: { name: 'cookieConsent', value: consentType, action: 'forced_test' } 
    }));
    
    console.log('[Analytics Debug] Forced consent set. Check debug info for updates.');
  };
  
  analyticsLog('Analytics debug functions exposed globally');
}
