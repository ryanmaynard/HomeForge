/**
 * Rate Limiter
 *
 * Prevents abuse by limiting the number of requests within a time window.
 * Useful for API calls and user actions.
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private calls: Map<string, number[]> = new Map();
  private config: Record<string, RateLimitConfig> = {};

  /**
   * Register a rate limit configuration
   */
  register(key: string, config: RateLimitConfig): void {
    this.config[key] = config;
  }

  /**
   * Check if a request can be made
   */
  canMakeRequest(key: string, customConfig?: RateLimitConfig): boolean {
    const config = customConfig || this.config[key];

    if (!config) {
      // No rate limit configured, allow request
      return true;
    }

    const now = Date.now();
    const calls = this.calls.get(key) || [];

    // Remove calls outside the time window
    const recentCalls = calls.filter((time) => now - time < config.windowMs);

    // Check if limit is exceeded
    if (recentCalls.length >= config.maxRequests) {
      return false;
    }

    // Add current call
    recentCalls.push(now);
    this.calls.set(key, recentCalls);

    return true;
  }

  /**
   * Get remaining requests
   */
  getRemainingRequests(key: string): number {
    const config = this.config[key];

    if (!config) {
      return Infinity;
    }

    const now = Date.now();
    const calls = this.calls.get(key) || [];
    const recentCalls = calls.filter((time) => now - time < config.windowMs);

    return Math.max(0, config.maxRequests - recentCalls.length);
  }

  /**
   * Get time until next request is allowed
   */
  getTimeUntilReset(key: string): number {
    const config = this.config[key];

    if (!config) {
      return 0;
    }

    const now = Date.now();
    const calls = this.calls.get(key) || [];

    if (calls.length === 0) {
      return 0;
    }

    const oldestCall = calls[0];
    const resetTime = oldestCall + config.windowMs;

    return Math.max(0, resetTime - now);
  }

  /**
   * Clear rate limit for a specific key
   */
  clear(key: string): void {
    this.calls.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.calls.clear();
  }

  /**
   * Cleanup old entries
   */
  cleanup(): void {
    const now = Date.now();

    for (const [key, calls] of this.calls.entries()) {
      const config = this.config[key];

      if (!config) {
        continue;
      }

      const recentCalls = calls.filter((time) => now - time < config.windowMs);

      if (recentCalls.length === 0) {
        this.calls.delete(key);
      } else {
        this.calls.set(key, recentCalls);
      }
    }
  }
}

// Create singleton instance
export const rateLimiter = new RateLimiter();

// Default rate limit configurations
rateLimiter.register('weather-api', {
  maxRequests: 10,
  windowMs: 60 * 1000, // 10 requests per minute
});

rateLimiter.register('crypto-api', {
  maxRequests: 30,
  windowMs: 60 * 1000, // 30 requests per minute
});

rateLimiter.register('rss-api', {
  maxRequests: 20,
  windowMs: 60 * 1000, // 20 requests per minute
});

rateLimiter.register('widget-add', {
  maxRequests: 10,
  windowMs: 60 * 1000, // 10 widget additions per minute
});

// Run cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    rateLimiter.cleanup();
  }, 5 * 60 * 1000);
}

/**
 * Rate limit wrapper for async functions
 */
export const withRateLimit = async <T>(
  key: string,
  fn: () => Promise<T>,
  onRateLimited?: () => void
): Promise<T> => {
  if (!rateLimiter.canMakeRequest(key)) {
    const resetTime = rateLimiter.getTimeUntilReset(key);

    if (onRateLimited) {
      onRateLimited();
    }

    throw new Error(
      `Rate limit exceeded. Try again in ${Math.ceil(resetTime / 1000)} seconds.`
    );
  }

  return await fn();
};
