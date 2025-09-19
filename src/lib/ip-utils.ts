// Utility functions for IP address handling

export async function getClientIP(): Promise<string | null> {
  try {
    // Try to get IP from ipify service
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Failed to get client IP:', error);
    
    // Fallback: try another service
    try {
      const response = await fetch('https://httpbin.org/ip');
      const data = await response.json();
      return data.origin.split(',')[0].trim();
    } catch (fallbackError) {
      console.warn('Failed to get IP from fallback service:', fallbackError);
      return null;
    }
  }
}

// Hash IP for privacy (basic client-side hashing for logging)
export function hashIP(ip: string): string {
  // Simple hash for client-side use (not cryptographically secure)
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

// Check if IP is likely valid format
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}