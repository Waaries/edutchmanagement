
// Cookie management utilities

export const setCookie = (name: string, value: string, days: number = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict";
  
  // Debug logging
  console.log(`[Cookie Debug] Set cookie: ${name}=${value}`);
  
  // Trigger cookie change event for real-time updates
  window.dispatchEvent(new CustomEvent('cookieChange', { 
    detail: { name, value, action: 'set' } 
  }));
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const eraseCookie = (name: string) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict;';
  
  // Debug logging
  console.log(`[Cookie Debug] Erased cookie: ${name}`);
  
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
  console.log(`[Cookie Debug] Consent status: ${consent}`);
  return consent;
};

export const hasAnalyticsConsent = (): boolean => {
  const consent = getConsentStatus() === 'all';
  console.log(`[Cookie Debug] Has analytics consent: ${consent}`);
  return consent;
};

export const hasMarketingConsent = (): boolean => {
  return getConsentStatus() === 'all';
};

// Enhanced cookie debugging function
export const debugCookies = () => {
  const allCookies = getAllCookies();
  console.log('[Cookie Debug] All cookies:', allCookies);
  console.log('[Cookie Debug] Consent status:', getConsentStatus());
  console.log('[Cookie Debug] Has analytics consent:', hasAnalyticsConsent());
  console.log('[Cookie Debug] Document.cookie raw:', document.cookie);
  return {
    allCookies,
    consentStatus: getConsentStatus(),
    hasAnalyticsConsent: hasAnalyticsConsent(),
    rawCookies: document.cookie
  };
};

// Expose debug function globally
if (typeof window !== 'undefined') {
  (window as any).debugCookies = debugCookies;
}

// Set cookies based on consent
export const setConsentCookies = (consentType: 'all' | 'essential') => {
  console.log(`[Cookie Debug] Setting consent cookies: ${consentType}`);
  
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
        }, 100);
      }
    });
    
    console.log('[Cookie Debug] Analytics tracking enabled');
  } else {
    // Remove analytics cookies if we only have essential consent
    eraseCookie('analyticsEnabled');
    
    // Disable analytics if consent is withdrawn
    import('./analytics').then(({ disableAnalytics }) => {
      if (typeof window !== 'undefined') {
        disableAnalytics();
      }
    });
    
    console.log('[Cookie Debug] Analytics tracking disabled');
  }
  
  // Force refresh of debug info after cookie changes
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('cookieChange', { 
      detail: { name: 'cookieConsent', value: consentType, action: 'consent_updated' } 
    }));
  }, 50);
};
