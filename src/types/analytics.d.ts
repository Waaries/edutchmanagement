
// Google Analytics gtag declarations
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    gtagReady?: boolean;
  }
}

export {};
