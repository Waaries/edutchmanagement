// Utility functions for IP address handling

export async function getClientIP(): Promise<string | null> {
  // Try multiple methods to get client IP, but don't fail if none work
  const ipSources = [
    async () => {
      const response = await fetch('https://api.ipify.org?format=json', {
        method: 'GET',
        mode: 'cors'
      });
      if (!response.ok) throw new Error('API response not ok');
      const data = await response.json();
      return data.ip;
    },
    async () => {
      const response = await fetch('https://httpbin.org/ip', {
        method: 'GET', 
        mode: 'cors'
      });
      if (!response.ok) throw new Error('API response not ok');
      const data = await response.json();
      return data.origin?.split(',')[0]?.trim();
    }
  ];

  for (const getIP of ipSources) {
    try {
      const ip = await getIP();
      if (ip && isValidIP(ip)) return ip;
    } catch (error) {
      console.warn('IP source failed:', error);
      continue;
    }
  }

  // If all methods fail, return null - this is acceptable for form submission
  console.info('Could not determine client IP - continuing with null value');
  return null;
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