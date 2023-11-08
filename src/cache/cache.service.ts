import { ICacheService } from './cache.service.interface'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Injectable, Inject } from '@nestjs/common'
import { Cache } from 'cache-manager'

@Injectable()
export class CacheService implements ICacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getFromCache<T>(key: string): Promise<T | null> {
    // console.log(1);
    try {
      const cachedItem = await this.cacheManager.get<T>(key)
      return cachedItem ? cachedItem : null
    } catch (err) {
      console.error('캐시 데이터 액세스 실패:', err)
      return null
    }
  }

  async setCache<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      if (ttl) await this.cacheManager.set(key, value, ttl)
      else await this.cacheManager.set(key, value)
    } catch (err) {
      console.error('캐시 데이터 설정 실패', err)
    }
  }

  async deleteCache(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key)
    } catch (err) {
      console.error('캐시 데이터 삭제 실패', err)
    }
  }
}
