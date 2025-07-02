// Performance optimization utilities
import { monitoring } from './monitoring';

// Performance budgets
export const PERFORMANCE_BUDGETS = {
  LCP: 2500, // Largest Contentful Paint
  FID: 100,  // First Input Delay
  CLS: 0.1,  // Cumulative Layout Shift
  TTFB: 800, // Time to First Byte
  FCP: 1800, // First Contentful Paint
};

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Track LCP
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as any;
    if (lastEntry) {
      const lcp = lastEntry.startTime;
      monitoring.reportPerformance('lcp', lcp, {
        element: lastEntry.element?.tagName || 'unknown',
        budget: PERFORMANCE_BUDGETS.LCP,
        budgetMet: lcp <= PERFORMANCE_BUDGETS.LCP
      });
    }
  });

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    console.warn('LCP observer not supported');
  }

  // Track FID
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      const fid = entry.processingStart - entry.startTime;
      monitoring.reportPerformance('fid', fid, {
        eventType: entry.name,
        budget: PERFORMANCE_BUDGETS.FID,
        budgetMet: fid <= PERFORMANCE_BUDGETS.FID
      });
    });
  });

  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    console.warn('FID observer not supported');
  }

  // Track CLS
  let clsScore = 0;
  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsScore += entry.value;
      }
    });
    monitoring.reportPerformance('cls', clsScore, {
      budget: PERFORMANCE_BUDGETS.CLS,
      budgetMet: clsScore <= PERFORMANCE_BUDGETS.CLS
    });
  });

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.warn('CLS observer not supported');
  }
};

// Image optimization utilities
export const optimizeImage = (src: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
} = {}) => {
  const { width, height, quality = 85, format = 'auto' } = options;
  
  // Simple optimization for external services or CDNs
  let optimizedSrc = src;
  
  // Add query parameters for services that support them
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (quality < 100) params.set('q', quality.toString());
  if (format !== 'auto') params.set('f', format);
  
  if (params.toString()) {
    optimizedSrc += (src.includes('?') ? '&' : '?') + params.toString();
  }
  
  return optimizedSrc;
};

// Lazy loading utility
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Resource hints
export const addResourceHints = () => {
  if (typeof document === 'undefined') return;

  const hints = [
    // DNS prefetch for external domains
    { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
    { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
    
    // Preconnect for critical domains
    { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: true },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if ('crossorigin' in hint) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
};

// Critical CSS inlining utility
export const inlineCriticalCSS = (css: string) => {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
};

// Bundle size monitoring
export const reportBundleSize = () => {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) return;

  const connection = (navigator as any).connection;
  const bundleSize = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (bundleSize && bundleSize.transferSize) {
    monitoring.reportPerformance('bundle_size', bundleSize.transferSize, {
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      saveData: connection?.saveData
    });
  }
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (typeof window === 'undefined' || !('performance' in window)) return;

  const perf = window.performance as any;
  if (perf.memory) {
    const memoryInfo = {
      used: perf.memory.usedJSHeapSize,
      total: perf.memory.totalJSHeapSize,
      limit: perf.memory.jsHeapSizeLimit
    };

    monitoring.reportPerformance('memory_usage', memoryInfo.used, {
      total: memoryInfo.total,
      limit: memoryInfo.limit,
      percentage: (memoryInfo.used / memoryInfo.limit) * 100
    });
  }
};

// Frame rate monitoring
let frameCount = 0;
let lastFrameTime = performance.now();

export const monitorFrameRate = () => {
  const now = performance.now();
  frameCount++;

  if (now - lastFrameTime >= 1000) {
    const fps = frameCount;
    frameCount = 0;
    lastFrameTime = now;

    monitoring.reportPerformance('fps', fps, {
      target: 60,
      performant: fps >= 55
    });
  }

  requestAnimationFrame(monitorFrameRate);
};

// Performance initialization
export const initializePerformanceMonitoring = () => {
  // Start monitoring after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      trackWebVitals();
      addResourceHints();
      reportBundleSize();
      
      // Start memory and FPS monitoring
      setInterval(monitorMemoryUsage, 30000); // Every 30 seconds
      
      // Start frame rate monitoring
      if (typeof requestAnimationFrame !== 'undefined') {
        monitorFrameRate();
      }
    }, 1000);
  });
};