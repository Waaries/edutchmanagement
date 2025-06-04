
// Cookie management utilities

export const setCookie = (name: string, value: string, days: number = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict";
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

// Cookie consent helper functions
export const getConsentStatus = (): 'all' | 'essential' | null => {
  return getCookie('cookieConsent') as 'all' | 'essential' | null;
};

export const hasAnalyticsConsent = (): boolean => {
  return getConsentStatus() === 'all';
};

export const hasMarketingConsent = (): boolean => {
  return getConsentStatus() === 'all';
};

// Set cookies based on consent
export const setConsentCookies = (consentType: 'all' | 'essential') => {
  // Set the consent cookie itself
  setCookie('cookieConsent', consentType);
  
  // Set consent timestamp
  setCookie('cookieConsentTimestamp', new Date().toISOString());
  
  if (consentType === 'all') {
    // Enable analytics cookies if we have full consent
    setCookie('analyticsEnabled', 'true');
    
    // Initialize analytics if consent is granted
    import('./analytics').then(({ initializeAnalytics, enableAnalytics }) => {
      if (typeof window.gtag !== 'undefined') {
        enableAnalytics();
      } else {
        initializeAnalytics();
      }
    });
    
    console.log('Analytics tracking enabled');
  } else {
    // Remove analytics cookies if we only have essential consent
    eraseCookie('analyticsEnabled');
    
    // Disable analytics if consent is withdrawn
    import('./analytics').then(({ disableAnalytics }) => {
      disableAnalytics();
    });
    
    console.log('Analytics tracking disabled');
  }
};
