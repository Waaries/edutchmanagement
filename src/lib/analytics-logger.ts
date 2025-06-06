import { isProduction } from './analytics-config';

// Enhanced logging for production debugging
export const analyticsLog = (message: string, data?: any) => {
  const prefix = isProduction() ? '[PROD Analytics]' : '[DEV Analytics]';
  console.log(prefix, message, data || '');
  
  // In production, also log to a global debug array for inspection
  if (isProduction() && typeof window !== 'undefined') {
    if (!(window as any).analyticsDebugLog) {
      (window as any).analyticsDebugLog = [];
    }
    (window as any).analyticsDebugLog.push({
      timestamp: new Date().toISOString(),
      message,
      data: data || null,
      url: window.location.href
    });
    
    // Keep only last 50 entries
    if ((window as any).analyticsDebugLog.length > 50) {
      (window as any).analyticsDebugLog = (window as any).analyticsDebugLog.slice(-50);
    }
  }
};
