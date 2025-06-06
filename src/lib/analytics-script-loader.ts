
import { GA_MEASUREMENT_ID } from './analytics-config';
import { analyticsLog } from './analytics-logger';

// Script loading state
let scriptLoadingPromise: Promise<boolean> | null = null;

// Load Google Analytics script dynamically
export const loadGoogleAnalyticsScript = (): Promise<boolean> => {
  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve) => {
    analyticsLog('Loading Google Analytics script dynamically...');
    
    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag"]`);
    if (existingScript) {
      analyticsLog('Google Analytics script already exists');
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    
    script.onload = () => {
      analyticsLog('Google Analytics script loaded successfully');
      
      // Initialize dataLayer and gtag function if not already done
      if (!window.gtag) {
        (window as any).dataLayer = (window as any).dataLayer || [];
        window.gtag = function() {
          (window as any).dataLayer.push(arguments);
        };
      }
      
      (window as any).gtagReady = true;
      resolve(true);
    };
    
    script.onerror = () => {
      analyticsLog('ERROR: Failed to load Google Analytics script');
      resolve(false);
    };
    
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
};

// Check if gtag is ready
export const isGtagReady = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.gtag !== 'undefined' && 
         (window as any).gtagReady === true;
};
