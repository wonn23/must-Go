import { ReviewService } from '../review/review.service'
import { ReviewController } from '../review/review.controller'
import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmExModule } from '../common/decorator/typeoprm-ex.module'
import { Review } from './entities/review.entity'
import { ReviewRepository } from './review.repository'
import { Restaurant } from '../restaurant/entities/restaurant.entity'
import { RestaurantRepository } from '../restaurant/restaurant.repository'
import { AuthModule } from '../auth/auth.module'
import { JwtStrategy } from '../auth/jwt.strategy'
import { User } from '../user/entities/user.entity'
import { UserRepository } from '../user/user.repository'

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
