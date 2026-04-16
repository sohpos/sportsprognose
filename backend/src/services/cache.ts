// backend/src/services/cache.ts
// Redis-free caching layer with fallback to in-memory

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class CacheService<T = any> {
  private store = new Map<string, CacheEntry<T>>();
  private defaultTTL = 15 * 60 * 1000; // 15 minutes

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    
    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set(key: string, data: T, ttlMs?: number): void {
    const ttl = ttlMs || this.defaultTTL;
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    });
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  invalidatePattern(pattern: string): void {
    for (const key of this.store.keys()) {
      if (key.includes(pattern)) {
        this.store.delete(key);
      }
    }
  }

  clear(): void {
    this.store.clear();
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }
}

// Pre-computed data cache (longer TTL)
export const precomputeCache = new CacheService(60 * 60 * 1000); // 1 hour

// API response cache (shorter TTL)
export const apiCache = new CacheService(15 * 60 * 1000); // 15 minutes

// Score matrix cache (very long TTL - changes rarely)
export const scoreMatrixCache = new CacheService(6 * 60 * 60 * 1000); // 6 hours