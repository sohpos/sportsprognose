// backend/src/services/cache.ts
// Simple in-memory cache with TTL support

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class CacheService<T = any> {
  private store = new Map<string, CacheEntry<T>>();
  private defaultTTL = 15 * 60 * 1000;

  constructor(private ttlMs?: number) {}

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set(key: string, data: T, ttlMs?: number): void {
    const ttl = ttlMs || this.ttlMs || this.defaultTTL;
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    });
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

// Pre-computed data cache (longer TTL)
export const precomputeCache = new CacheService<any>(60 * 60 * 1000);

// API response cache (shorter TTL)
export const apiCache = new CacheService<any>(15 * 60 * 1000);

// Score matrix cache (very long TTL)
export const scoreMatrixCache = new CacheService<any>(6 * 60 * 60 * 1000);
