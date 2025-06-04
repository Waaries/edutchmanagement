
import { getCookie, hasAnalyticsConsent } from './cookie-utils';

// Google Analytics configuration
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 Measurement ID

// Initialize Google Analytics
export const initializeAnalytics = () => {
  if (!hasAnalyticsConsent()) {
    console.log('Analytics consent not granted, skipping initialization');
    return;
  }

  // Load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  
  // Make gtag available globally
  (window as any).gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=Strict;Secure',
    cookie_domain: window.location.hostname,
  });

  console.log('Google Analytics initialized');
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (!hasAnalyticsConsent() || typeof window.gtag === 'undefined') {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (!hasAnalyticsConsent() || typeof window.gtag === 'undefined') {
    return;
  }

  window.gtag('event', eventName, {
    event_category: 'engagement',
    ...parameters,
  });
};

// Track form submissions
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  trackEvent('form_submit', {
    form_name: formName,
    success: success,
    event_category: 'form',
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    click_location: location,
    event_category: 'interaction',
  });
};

// Track navigation
export const trackNavigation = (destination: string, source?: string) => {
  trackEvent('navigation', {
    destination: destination,
    source: source,
    event_category: 'navigation',
  });
};

// Disable analytics (for consent withdrawal)
export const disableAnalytics = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
    });
  }
  console.log('Google Analytics disabled');
};

// Enable analytics (for consent granting)
export const enableAnalytics = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
    });
  } else {
    // If gtag isn't loaded yet, initialize analytics
    initializeAnalytics();
  }
  console.log('Google Analytics enabled');
};
