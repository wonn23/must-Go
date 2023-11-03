import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ReviewRepository } from '../review/review.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { ReviewDto } from './dto/review.dto'
import { Review } from './entities/review.entity'
import { RestaurantRepository } from 'src/restaurant/restaurant.repository'
import { User } from 'src/user/entities/user.entity'
import { UserRepository } from 'src/user/user.repository'
import { LessThanOrEqual } from 'typeorm'

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(ReviewRepository)
    private reviewRepository: ReviewRepository,
    @InjectRepository(RestaurantRepository)
    private restaurantRepository: RestaurantRepository,
  ) {}

  async getAllReviews(): Promise<Review[]> {
    try {
      return this.reviewRepository.find()
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
    try {
      const reviewer = await this.userRepository.findOne({
        where: { id: user.id },
      })
      if (!reviewer) {
        throw new NotFoundException('유저를 찾을 수 없습니다.')
      }

      const restaurant = await this.restaurantRepository.findOne({
        where: { id: restaurantId },
      })
      if (!restaurant) {
        throw new NotFoundException('해당하는 맛집을 찾을 수 없습니다.')
      }

      const review = new Review()
      review.score = reviewDto.score
      review.content = reviewDto.content
      review.restaurant = restaurant

      return this.reviewRepository.save(review)
    } catch (error) {
      throw new InternalServerErrorException('리뷰 작성에 실패했습니다.')
    }
  }

  async updateReview(
    restaurantId: number,
    reviewId: number,
    reviewDto: ReviewDto,
    user: User,
  ): Promise<Review> {
    try {
      const reviewer = await this.userRepository.findOne({
        where: { id: user.id },
      })
      if (!reviewer) {
        throw new NotFoundException('유저를 찾을 수 없습니다.')
      }

      const restaurant = await this.restaurantRepository.findOne({
        where: { id: restaurantId },
      })
      if (!restaurant) {
        throw new NotFoundException('해당하는 맛집을 찾을 수 없습니다.')
      }

      const review = await this.reviewRepository.findOne({
        where: { id: reviewId },
      })
      if (!review) {
        throw new NotFoundException('해당 맛집의 리뷰를 찾을 수 없습니다.')
      }

      review.score = reviewDto.score
      review.content = reviewDto.content

      await this.reviewRepository.update(review.id, review)
      return review
    } catch (error) {
      throw new InternalServerErrorException('리뷰를 수정하는데 실패했습니다.')
    }
  }

  async deleteReview(
    restaurantId: number,
    reviewId: number,
    user: User,
  ): Promise<void> {
    try {
      const reviewer = await this.userRepository.findOne({
        where: { id: user.id },
      })
      if (!reviewer) {
        throw new NotFoundException('유저를 찾을 수 없습니다.')
      }

      const restaurant = await this.restaurantRepository.findOne({
        where: { id: restaurantId },
      })
      if (!restaurant) {
        throw new NotFoundException('해당하는 맛집을 찾을 수 없습니다.')
      }

      const review = await this.reviewRepository.findOne({
        where: { id: reviewId },
      })
      if (!review) {
        throw new NotFoundException('해당 맛집의 리뷰를 찾을 수 없습니다.')
      }

      await this.reviewRepository.softDelete(review.id)
    } catch (error) {
      throw new InternalServerErrorException('리뷰를 삭제하는데 실패했습니다.')
    }
  }

  // async averageScore() {
  //   const [scores, totalCount] = await this.reviewRepository.findAndCount({
  //     where: {
  //       score: LessThanOrEqual(5),
  //     },
  //   })

  //   return { scores, totalCount } // 평점 평균은 -> 모든 평점의 합/평가한 사람수
  // }
}
