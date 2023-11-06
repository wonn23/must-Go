import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeORMConfig } from './config/typeorm.config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { RestaurantModule } from './restaurant/restaurant.module'
import scheduleConfig from './config/schedule.config'
import { ScheduleModule } from '@nestjs/schedule'
import { ReviewModule } from './review/review.module'
import { RegionModule } from './region/region.module'
import { RedisCacheModule } from './cache/cache.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // validationSchema,
      load: [scheduleConfig],
      cache: true,
      envFilePath: [
        process.env.NODE_ENV === 'production'
          ? '.production.env'
          : '.development.env',
      ],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        await typeORMConfig(configService),
    }),
    AuthModule,
    UserModule,
    RestaurantModule,
    ReviewModule,
    RedisCacheModule,
    RegionModule,
  ],
})
export class AppModule {}
