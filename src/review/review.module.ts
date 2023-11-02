import { ReviewService } from '../review/review.service'
import { ReviewController } from '../review/review.controller'
import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmExModule } from 'src/common/decorator/typeoprm-ex.module'
import { Review } from './entities/review.entity'
import { ReviewRepository } from './review.repository'
import { Restaurant } from 'src/restaurant/entities/restaurant.entity'
import { RestaurantRepository } from 'src/restaurant/restaurant.repository'
import { AuthModule } from 'src/auth/auth.module'
import { JwtStrategy } from 'src/auth/jwt.strategy'
import { User } from 'src/user/entities/user.entity'
import { UserRepository } from 'src/user/user.repository'

@Module({
  imports: [
    HttpModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User, Review, Restaurant]),
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      ReviewRepository,
      RestaurantRepository,
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, JwtStrategy],
})
export class ReviewModule {}
