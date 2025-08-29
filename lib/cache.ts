// Client-side cache utility for better performance
interface CacheItem<T> {
  data: T
  timestamp: number
  expiresAt: number
}

class ClientCache {
  private cache = new Map<string, CacheItem<unknown>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes in milliseconds

  set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
    const now = Date.now()
    const cacheItem: CacheItem<T> = {
      data: value,
      timestamp: now,
      expiresAt: now + ttl,
    }
    this.cache.set(key, cacheItem)
  }

  get<T>(key: string): T | null {
    const cacheItem = this.cache.get(key)
    if (!cacheItem) {
      return null
    }

    const now = Date.now()
    if (now > cacheItem.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return cacheItem.data as T
  }

  has(key: string): boolean {
    const cacheItem = this.cache.get(key)
    if (!cacheItem) {
      return false
    }

    const now = Date.now()
    if (now > cacheItem.expiresAt) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  // Invalidate cache for a specific type
  invalidateByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key)
      }
    }
  }
}

// Create a singleton instance
export const clientCache = new ClientCache()

// Auto cleanup every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    clientCache.cleanup()
  }, 10 * 60 * 1000)
}

// Helper function for cached fetch
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Check if we have cached data
  const cachedData = clientCache.get<T>(key)
  if (cachedData !== null) {
    return cachedData
  }

  // Fetch new data
  const data = await fetcher()
  clientCache.set(key, data, ttl)
  
  return data
}

// Cache invalidation helpers
export const cacheKeys = {
  projects: {
    all: 'projects:all',
    byId: (id: string) => `projects:${id}`,
    featured: 'projects:featured'
  },
  blog: {
    all: 'blog:all',
    published: 'blog:published',
    bySlug: (slug: string) => `blog:${slug}`,
    featured: 'blog:featured'
  }
}

export const invalidateCache = {
  projects: () => clientCache.invalidateByPrefix('projects:'),
  blog: () => clientCache.invalidateByPrefix('blog:'),
  all: () => clientCache.clear()
}
