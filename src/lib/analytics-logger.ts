
import { isProduction } from './analytics-config';

// Enhanced logging for production debugging
export const analyticsLog = (message: string, data?: any) => {
  const prefix = isProduction() ? '[PROD Analytics]' : '[DEV Analytics]';
  
  // Reduce console logging in production - only log important events
  if (isProduction()) {
    // Only log errors and critical events in production
    if (message.toLowerCase().includes('error') || 
        message.toLowerCase().includes('failed') || 
        message.toLowerCase().includes('enabled') ||
        message.toLowerCase().includes('disabled') ||
        message.toLowerCase().includes('initialization')) {
      console.log(prefix, message, data || '');
    }
  } else {
    // In development, only log important messages to reduce noise
    if (message.toLowerCase().includes('error') || 
        message.toLowerCase().includes('failed') || 
        message.toLowerCase().includes('enabled') ||
        message.toLowerCase().includes('disabled') ||
        message.toLowerCase().includes('initialization') ||
        message.toLowerCase().includes('tracking')) {
      console.log(prefix, message, data || '');
    }
  }
  
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
