import { devLog } from "@/lib/logger";

// Cookie management utilities with enhanced error handling and fallback support

// Detect if we're in a preview/iframe environment
const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

// Fallback storage for environments where cookies don't work
const fallbackStorage = {
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(`cookie_fallback_${key}`, value);
      devLog(`[Cookie Fallback] Set ${key}=${value} in localStorage`);
    } catch (error) {
      console.error(`[Cookie Fallback] Failed to set ${key}:`, error);
    }
  },
  get: (key: string): string | null => {
    try {
      const value = localStorage.getItem(`cookie_fallback_${key}`);
      devLog(`[Cookie Fallback] Get ${key}=${value} from localStorage`);
      return value;
    } catch (error) {
      console.error(`[Cookie Fallback] Failed to get ${key}:`, error);
      return null;
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(`cookie_fallback_${key}`);
      devLog(`[Cookie Fallback] Removed ${key} from localStorage`);
    } catch (error) {
      console.error(`[Cookie Fallback] Failed to remove ${key}:`, error);
    }
  }
};

export const setCookie = (name: string, value: string, days: number = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  
  // Use SameSite=Lax for better compatibility with preview environments
  const cookieString = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  
  try {
    document.cookie = cookieString;
    
    // Verify the cookie was actually set
    const verification = getCookieDirectly(name);
    if (verification === value) {
      devLog(`[Cookie Debug] Successfully set cookie: ${name}=${value}`);
    } else {
      console.warn(`[Cookie Debug] Cookie verification failed for ${name}. Expected: ${value}, Got: ${verification}`);
      
      // Use fallback storage if cookie setting failed
      if (isInIframe()) {
        devLog(`[Cookie Debug] Iframe detected, using fallback storage for ${name}`);
        fallbackStorage.set(name, value);
      }
    }
  } catch (error) {
    console.error(`[Cookie Debug] Error setting cookie ${name}:`, error);
    
    // Use fallback storage on error
    fallbackStorage.set(name, value);
  }
  
  // Trigger cookie change event for real-time updates
  window.dispatchEvent(new CustomEvent('cookieChange', { 
    detail: { name, value, action: 'set' } 
  }));
};

// Direct cookie reading without fallback (for verification)
const getCookieDirectly = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const getCookie = (name: string): string | null => {
  // First try to get from actual cookies
  const cookieValue = getCookieDirectly(name);
  
  if (cookieValue !== null) {
    return cookieValue;
  }
  
  // If cookie not found and we're in an iframe, try fallback storage
  if (isInIframe()) {
    const fallbackValue = fallbackStorage.get(name);
    if (fallbackValue !== null) {
      devLog(`[Cookie Debug] Using fallback value for ${name}: ${fallbackValue}`);
      return fallbackValue;
    }
  }
  
  return null;
};

export const eraseCookie = (name: string) => {
  // Remove from actual cookies
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;';
  
  // Also remove from fallback storage
  fallbackStorage.remove(name);
  
  devLog(`[Cookie Debug] Erased cookie: ${name}`);
  
  // Trigger cookie change event
  window.dispatchEvent(new CustomEvent('cookieChange', { 
    detail: { name, value: null, action: 'erase' } 
  }));
};

export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  const cookieArr = document.cookie.split(';');
  
  cookieArr.forEach(cookie => {
    const cookiePair = cookie.split('=');
    if (cookiePair[0].trim()) {
      cookies[cookiePair[0].trim()] = cookiePair[1] || '';
    }
  });
  
  // If we're in an iframe, also check fallback storage
  if (isInIframe()) {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cookie_fallback_')) {
          const cookieName = key.replace('cookie_fallback_', '');
          const value = localStorage.getItem(key);
          if (value && !cookies[cookieName]) {
            cookies[cookieName] = value;
          }
        }
      }
    } catch (error) {
      console.error('[Cookie Debug] Error reading fallback storage:', error);
    }
  }
  
  return cookies;
};

export const clearAllCookies = (exceptions: string[] = []) => {
  const cookies = getAllCookies();
  
  Object.keys(cookies).forEach(cookie => {
    if (!exceptions.includes(cookie)) {
      eraseCookie(cookie);
    }
  });
};

// Cookie consent helper functions with enhanced debugging
export const getConsentStatus = (): 'all' | 'essential' | null => {
  const consent = getCookie('cookieConsent') as 'all' | 'essential' | null;
  devLog(`[Cookie Debug] Consent status: ${consent} (iframe: ${isInIframe()})`);
  return consent;
};

export const hasAnalyticsConsent = (): boolean => {
  const consent = getConsentStatus() === 'all';
  devLog(`[Cookie Debug] Has analytics consent: ${consent} (iframe: ${isInIframe()})`);
  return consent;
};

export const hasMarketingConsent = (): boolean => {
  return getConsentStatus() === 'all';
};

// Enhanced cookie debugging function
export const debugCookies = () => {
  const allCookies = getAllCookies();
  const isIframe = isInIframe();
  
  devLog('[Cookie Debug] Environment info:', {
    isIframe,
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    userAgent: navigator.userAgent.substring(0, 100)
  });
  
  devLog('[Cookie Debug] All cookies:', allCookies);
  devLog('[Cookie Debug] Consent status:', getConsentStatus());
  devLog('[Cookie Debug] Has analytics consent:', hasAnalyticsConsent());
  devLog('[Cookie Debug] Document.cookie raw:', document.cookie);
  
  // Check fallback storage
  if (isIframe) {
    const fallbackData: Record<string, string> = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cookie_fallback_')) {
          fallbackData[key] = localStorage.getItem(key) || '';
        }
      }
      devLog('[Cookie Debug] Fallback storage:', fallbackData);
    } catch (error) {
      devLog('[Cookie Debug] Cannot access fallback storage:', error);
    }
  }
  
  return {
    allCookies,
    consentStatus: getConsentStatus(),
    hasAnalyticsConsent: hasAnalyticsConsent(),
    rawCookies: document.cookie,
    isIframe,
    fallbackAvailable: isIframe,
    timestamp: new Date().toISOString()
  };
};

// Expose debug function globally
if (typeof window !== 'undefined') {
  (window as any).debugCookies = debugCookies;
  (window as any).clearConsentCookies = () => {
    devLog('[Cookie Debug] Clearing all consent cookies for testing');
    eraseCookie('cookieConsent');
    eraseCookie('analyticsEnabled');
    eraseCookie('cookieConsentTimestamp');
    devLog('[Cookie Debug] Consent cookies cleared. Refresh the page to see the dialog.');
  };
  
  // Add helper to test cookie setting
  (window as any).testCookieSet = (name = 'test', value = 'test_value') => {
    devLog(`[Cookie Debug] Testing cookie setting: ${name}=${value}`);
    setCookie(name, value, 1);
    const retrieved = getCookie(name);
    devLog(`[Cookie Debug] Retrieved value: ${retrieved}`);
    devLog(`[Cookie Debug] Test ${retrieved === value ? 'PASSED' : 'FAILED'}`);
    return retrieved === value;
  };
}

// Set cookies based on consent with enhanced error handling
export const setConsentCookies = (consentType: 'all' | 'essential') => {
  devLog(`[Cookie Debug] Setting consent cookies: ${consentType}`);
  
  // Set the consent cookie itself
  setCookie('cookieConsent', consentType);
  
  // Set consent timestamp
  setCookie('cookieConsentTimestamp', new Date().toISOString());
  
  if (consentType === 'all') {
    // Enable analytics cookies if we have full consent
    setCookie('analyticsEnabled', 'true');
    
    // Initialize analytics if consent is granted
    import('./analytics').then(({ enableAnalytics, initializeAnalytics }) => {
      // Ensure we're in browser environment
      if (typeof window !== 'undefined') {
        // Re-initialize analytics with consent
        setTimeout(async () => {
          await initializeAnalytics();
          enableAnalytics();
          
          // Verify consent was properly set
          setTimeout(() => {
            const verifyConsent = getConsentStatus();
            devLog(`[Cookie Debug] Consent verification after setting: ${verifyConsent}`);
            if (verifyConsent !== consentType) {
              console.error(`[Cookie Debug] Consent verification failed! Expected: ${consentType}, Got: ${verifyConsent}`);
            }
          }, 200);
        }, 100);
      }
    });
    
    devLog('[Cookie Debug] Analytics tracking enabled');
  } else {
    // Remove analytics cookies if we only have essential consent
    eraseCookie('analyticsEnabled');
    
    // Disable analytics if consent is withdrawn
    import('./analytics').then(({ disableAnalytics }) => {
      if (typeof window !== 'undefined') {
        disableAnalytics();
      }
    });
    
    devLog('[Cookie Debug] Analytics tracking disabled');
  }
  
  // Force refresh of debug info after cookie changes with multiple attempts
  [50, 150, 300].forEach(delay => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('cookieChange', { 
        detail: { name: 'cookieConsent', value: consentType, action: 'consent_updated' } 
      }));
    }, delay);
  });
};
