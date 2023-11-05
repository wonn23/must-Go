import { Module } from '@nestjs/common'
import { RestaurantService } from './restaurant.service'
import { RestaurantController } from './restaurant.controller'
import { HttpModule } from '@nestjs/axios/dist'
import { ScheduleService } from './schedule.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Restaurant } from './entities/restaurant.entity'
import { TypeOrmExModule } from 'src/common/decorator/typeoprm-ex.module'
import { RestaurantRepository } from './restaurant.repository'
import { PassportModule } from '@nestjs/passport'
import { Review } from 'src/review/entities/review.entity'
import { ReviewRepository } from 'src/review/review.repository'

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Restaurant, Review]),
    TypeOrmExModule.forCustomRepository([
      RestaurantRepository,
      ReviewRepository,
    ]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService, ScheduleService],
})
export class RestaurantModule {}
