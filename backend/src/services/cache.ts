import { Request, Response } from 'express';

// Simple in-memory cache with TTL
interface CacheEntry {
  data: any;
  timestamp: number;
}

class DataCache {
  private cache = new Map<string, CacheEntry>();
  private ttl: number;

  constructor(ttlMinutes: number = 15) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < this.ttl) {
      return entry.data;
    }
    this.cache.delete(key);
    return null;
  }

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  invalidate(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Default 15-minute cache
const cache = new DataCache(15);

// Cron job storage (for in-process scheduling)
let cronJobInterval: NodeJS.Timeout | null = null;

export { cache, DataCache, cronJobInterval };

// Health check endpoint for cache
export function handleCacheStats(_req: Request, res: Response): void {
  res.json(cache.getStats());
}

// Manual cache invalidation endpoint
export function handleCacheInvalidate(_req: Request, res: Response): void {
  cache.invalidate();
  res.json({ message: 'Cache invalidated' });
}

// Setup cron job (runs daily)
export function setupDailyCron(fetchFn: () => Promise<void>): void {
  // Clear any existing interval
  if (cronJobInterval) {
    clearInterval(cronJobInterval);
  }

  // Run every 24 hours
  cronJobInterval = setInterval(async () => {
    try {
      console.log('[CRON] Starting daily data fetch...');
      await fetchFn();
      console.log('[CRON] Daily data fetch complete');
    } catch (error) {
      console.error('[CRON] Error:', error);
    }
  }, 24 * 60 * 60 * 1000);

  console.log('[CRON] Daily cron job scheduled (24h)');
}