import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { ReviewService } from './review.service'
import { AuthGuard } from '@nestjs/passport'
import { ReviewDto } from './dto/review.dto'
import { Review } from './entities/review.entity'
import { GetUser } from 'src/auth/get-user.decorator'
import { User } from 'src/user/entities/user.entity'

@Controller('restaurants/:restaurantId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAllReviews() {
    return this.reviewService.getAllReviews()
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    return this.reviewService.getReviewById(+id)
  }

  @Post()
  @UseGuards(AuthGuard())
  async createReview(
    @Param('restaurantId') restaurantId: string,
    @Body(new ValidationPipe()) reviewDto: ReviewDto,
    @GetUser() user: User,
  ): Promise<object> {
    return await this.reviewService.createReview(+restaurantId, reviewDto, user)
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async updateReview(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body(new ValidationPipe()) reviewDto: ReviewDto,
    @GetUser() user: User,
  ): Promise<Review> {
    return this.reviewService.updateReview(+restaurantId, +id, reviewDto, user)
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteReview(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    this.reviewService.deleteReview(+restaurantId, +id, user)
  }
}
