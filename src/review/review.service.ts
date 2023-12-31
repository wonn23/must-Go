import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { ReviewRepository } from '../review/review.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { ReviewDto } from './dto/review.dto'
import { Review } from './entities/review.entity'
import { RestaurantRepository } from '../restaurant/restaurant.repository'
import { User } from '../user/entities/user.entity'
import { UserRepository } from '../user/user.repository'
import { DataSource } from 'typeorm'
import { Restaurant } from '../restaurant/entities/restaurant.entity'

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(ReviewRepository)
    private reviewRepository: ReviewRepository,
    @InjectRepository(RestaurantRepository)
    private restaurantRepository: RestaurantRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getAllReviews(): Promise<Review[]> {
    try {
      return this.reviewRepository.getAllReviews()
    } catch (error) {
      throw new InternalServerErrorException(
        '리뷰 목록을 불러오는데 실패했습니다.',
      )
    }
  }

  async getReviewById(id: number) {
    try {
      return await this.reviewRepository.findBy({ id })
    } catch (error) {
      throw new InternalServerErrorException(
        '해당 리뷰를 불러오는데 실패했습니다.',
      )
    }
  }

  async createReview(
    restaurantId: number,
    reviewDto: ReviewDto,
    user: User,
  ): Promise<object> {
    const queryRunner = this.dataSource.createQueryRunner() // 트랜잭션 설정

    await queryRunner.connect()
    await queryRunner.startTransaction('READ COMMITTED') // 트랜잭션 시작
    try {
      const reviewer = await queryRunner.manager.findOne(User, {
        where: { id: user.id },
      })
      if (!reviewer) {
        throw new NotFoundException('유저를 찾을 수 없습니다.')
      }

      const restaurant = await queryRunner.manager.findOne(Restaurant, {
        where: { id: restaurantId },
      })
      if (!restaurant) {
        throw new NotFoundException('해당하는 맛집을 찾을 수 없습니다.')
      }

      const review = new Review()
      review.score = reviewDto.score
      review.content = reviewDto.content
      review.restaurant = restaurant
      review.user = reviewer
      await this.reviewRepository.save(review)

      restaurant.score = await this.calculateAverageScore(restaurantId)
      await this.restaurantRepository.save(restaurant)

      return review
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException('리뷰 작성에 실패했습니다.')
    } finally {
      await queryRunner.release() // 트랜잭션 해제
    }
  }

  async updateReview(
    restaurantId: number,
    reviewId: number,
    reviewDto: ReviewDto,
    user: User,
  ): Promise<Review> {
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction('READ COMMITTED')
    try {
      const reviewer = await queryRunner.manager.findOne(User, {
        where: { id: user.id },
      })
      if (!reviewer) {
        throw new NotFoundException('유저를 찾을 수 없습니다.')
      }

      const restaurant = await queryRunner.manager.findOne(Restaurant, {
        where: { id: restaurantId },
      })
      if (!restaurant) {
        throw new NotFoundException('해당하는 맛집을 찾을 수 없습니다.')
      }

      const review = await queryRunner.manager.findOne(Review, {
        where: { id: reviewId },
      })
      if (!review) {
        throw new NotFoundException('해당 맛집의 리뷰를 찾을 수 없습니다.')
      }

      review.score = reviewDto.score
      review.content = reviewDto.content
      await this.reviewRepository.update(review.id, review)

      restaurant.score = await this.calculateAverageScore(restaurantId)
      await this.restaurantRepository.update(restaurant.id, restaurant)

      return review
    } catch (error) {
      throw new InternalServerErrorException('리뷰를 수정하는데 실패했습니다.')
    } finally {
      if (!Error) {
        await queryRunner.release()
      }
    }
  }

  async deleteReview(
    restaurantId: number,
    reviewId: number,
    user: User,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction('READ COMMITTED')
    try {
      const reviewer = await queryRunner.manager.findOne(User, {
        where: { id: user.id },
      })
      if (!reviewer) {
        throw new NotFoundException('유저를 찾을 수 없습니다.')
      }

      const restaurant = await queryRunner.manager.findOne(Restaurant, {
        where: { id: restaurantId },
      })
      if (!restaurant) {
        throw new NotFoundException('해당하는 맛집을 찾을 수 없습니다.')
      }

      const review = await queryRunner.manager.findOne(Review, {
        where: { id: reviewId },
      })
      if (!review) {
        throw new NotFoundException('해당 맛집의 리뷰를 찾을 수 없습니다.')
      }

      await this.reviewRepository.softDelete(review.id)

      restaurant.score = await this.calculateAverageScore(restaurantId)
      await this.restaurantRepository.update(restaurant.id, restaurant)
    } catch (error) {
      throw new InternalServerErrorException('리뷰를 삭제하는데 실패했습니다.')
    } finally {
      if (!Error) {
        await queryRunner.release()
      }
    }
  }

  async calculateAverageScore(restaurantId: number) {
    try {
      const [reviewsOfRestaurant, totalCount] =
        await this.reviewRepository.findAndCount({
          where: { restaurant: { id: restaurantId } },
        })

      const sumScore = reviewsOfRestaurant.reduce(
        (sum, review) => sum + review.score,
        0,
      )

      const averageScore = Math.round((sumScore / totalCount) * 10) / 10
      return averageScore
    } catch (error) {
      throw new InternalServerErrorException('평균 점수 계산에 실패했습니다.')
    }
  }
}
