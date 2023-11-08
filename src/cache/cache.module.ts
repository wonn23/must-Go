import { Module, Global } from '@nestjs/common'
import * as redisStore from 'cache-manager-ioredis'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import { cacheConfig } from '../config/cache.config'
import { CacheService } from './cache.service'
import { ICACHE_SERVICE } from '../common/provider.constant'

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: cacheConfig(configService).cacheHost,
        port: cacheConfig(configService).cachePort,
        ttl: 600,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    CacheService,
    {
      provide: ICACHE_SERVICE,
      useClass: CacheService,
    },
  ],
  exports: [ICACHE_SERVICE, CacheModule],
})
export class RedisCacheModule {}
