// Security utilities and headers configuration
export const SecurityHeaders = {
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'", 
      "'unsafe-inline'", 
      "'unsafe-eval'",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://fonts.googleapis.com",
      "https://cdn.gpteng.co"
    ],
    'style-src': [
      "'self'", 
      "'unsafe-inline'",
      "https://fonts.googleapis.com"
    ],
    'img-src': [
      "'self'", 
      "data:",
      "blob:",
      "https:",
      "*.supabase.co"
    ],
    'font-src': [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    'connect-src': [
      "'self'",
      "https://*.supabase.co",
      "https://www.google-analytics.com"
    ],
    'frame-src': [
      "https://www.google.com"
    ]
  },

  // Security headers configuration
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
};

// Apply security headers
export const applySecurityHeaders = () => {
  if (typeof document !== 'undefined') {
    // Add CSP meta tag
    const cspValue = Object.entries(SecurityHeaders.csp)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
    
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = cspValue;
    
    // Remove existing CSP meta if present
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCSP) {
      existingCSP.remove();
    }
    
    document.head.appendChild(cspMeta);
  }
};

// HTTPS redirect utility
export const enforceHTTPS = () => {
  if (typeof window !== 'undefined' && location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential XSS vectors
    .trim()
    .substring(0, 1000); // Limit length
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Rate limiting utility
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Filter out old attempts
    const recentAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();