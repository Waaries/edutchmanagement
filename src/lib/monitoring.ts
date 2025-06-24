
// Monitoring and error tracking utilities
export interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  timestamp: string;
  userAgent: string;
  userId?: string;
  sessionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  url: string;
  userId?: string;
  sessionId: string;
  context?: Record<string, any>;
}

export interface UserExperienceMetric {
  event: string;
  timestamp: string;
  url: string;
  userId?: string;
  sessionId: string;
  duration?: number;
  context?: Record<string, any>;
}

class MonitoringService {
  private sessionId: string;
  private userId?: string;
  private performanceObserver?: PerformanceObserver;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializePerformanceMonitoring();
    this.setupErrorHandling();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  // Error tracking
  reportError(error: Error | string, severity: ErrorReport['severity'] = 'medium', context?: Record<string, any>) {
    const errorReport: ErrorReport = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      userId: this.userId,
      sessionId: this.sessionId,
      severity,
      context
    };

    // Log to console for development
    console.error('[Monitoring] Error reported:', errorReport);

    // Send to monitoring service (could be extended to send to external service)
    this.sendToMonitoringService('error', errorReport);

    // Store locally for debugging
    this.storeLocally('errors', errorReport);
  }

  // Performance monitoring
  reportPerformance(name: string, value: number, context?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value: Math.round(value),
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.userId,
      sessionId: this.sessionId,
      context
    };

    console.log('[Monitoring] Performance metric:', metric);
    this.sendToMonitoringService('performance', metric);
    this.storeLocally('performance', metric);
  }

  // User experience tracking
  trackUserExperience(event: string, duration?: number, context?: Record<string, any>) {
    const metric: UserExperienceMetric = {
      event,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.userId,
      sessionId: this.sessionId,
      duration: duration ? Math.round(duration) : undefined,
      context
    };

    console.log('[Monitoring] UX metric:', metric);
    this.sendToMonitoringService('ux', metric);
    this.storeLocally('ux', metric);
  }

  private initializePerformanceMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();

    // Monitor navigation timing
    this.monitorNavigationTiming();

    // Monitor resource loading
    this.monitorResourceTiming();
  }

  private monitorCoreWebVitals() {
    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          if (lastEntry) {
            this.reportPerformance('lcp', lastEntry.startTime, {
              element: lastEntry.element?.tagName || 'unknown'
            });
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Monitor First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.reportPerformance('fid', entry.processingStart - entry.startTime, {
              eventType: entry.name
            });
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Monitor Cumulative Layout Shift (CLS)
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          });
          this.reportPerformance('cls', clsScore);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

      } catch (error) {
        console.warn('[Monitoring] Performance observer not supported:', error);
      }
    }
  }

  private monitorNavigationTiming() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.reportPerformance('page_load_time', navigation.loadEventEnd - navigation.fetchStart);
          this.reportPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
          this.reportPerformance('time_to_interactive', navigation.domInteractive - navigation.fetchStart);
        }
      }, 100);
    });
  }

  private monitorResourceTiming() {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.duration > 1000) { // Only report slow resources
              this.reportPerformance('slow_resource', entry.duration, {
                name: entry.name,
                type: (entry as any).initiatorType
              });
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('[Monitoring] Resource timing observer not supported:', error);
      }
    }
  }

  private setupErrorHandling() {
    if (typeof window === 'undefined') return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.reportError(event.error || event.message, 'high', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError(`Unhandled promise rejection: ${event.reason}`, 'high', {
        type: 'unhandledrejection'
      });
    });
  }

  private async sendToMonitoringService(type: string, data: any) {
    try {
      // For now, we'll just log. In production, you might want to send to an external service
      // or store in Supabase for later analysis
      if (window.location.hostname !== 'localhost') {
        // Only send in production to avoid noise during development
        console.log(`[Monitoring] Would send ${type} data to monitoring service:`, data);
      }
    } catch (error) {
      console.error('[Monitoring] Failed to send to monitoring service:', error);
    }
  }

  private storeLocally(type: string, data: any) {
    try {
      const key = `monitoring_${type}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(data);
      
      // Keep only last 100 entries to prevent storage bloat
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100);
      }
      
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.warn('[Monitoring] Failed to store locally:', error);
    }
  }

  // Utility methods for components to use
  startTimer(name: string) {
    const startTime = performance.now();
    return {
      end: (context?: Record<string, any>) => {
        const duration = performance.now() - startTime;
        this.reportPerformance(name, duration, context);
        return duration;
      }
    };
  }

  // Get monitoring data for debugging
  getLocalData(type: 'errors' | 'performance' | 'ux') {
    try {
      return JSON.parse(localStorage.getItem(`monitoring_${type}`) || '[]');
    } catch {
      return [];
    }
  }

  // Clear local monitoring data
  clearLocalData() {
    ['errors', 'performance', 'ux'].forEach(type => {
      localStorage.removeItem(`monitoring_${type}`);
    });
  }
}

// Export singleton instance
export const monitoring = new MonitoringService();

// Utility functions for easy use
export const reportError = (error: Error | string, severity?: ErrorReport['severity'], context?: Record<string, any>) => {
  monitoring.reportError(error, severity, context);
};

export const reportPerformance = (name: string, value: number, context?: Record<string, any>) => {
  monitoring.reportPerformance(name, value, context);
};

export const trackUserExperience = (event: string, duration?: number, context?: Record<string, any>) => {
  monitoring.trackUserExperience(event, duration, context);
};

export const startTimer = (name: string) => monitoring.startTimer(name);
