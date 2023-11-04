import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ReviewService } from './review.service'
import { AuthGuard } from '@nestjs/passport'
import { ReviewDto } from './dto/review.dto'
import { Review } from './entities/review.entity'
import { GetUser } from 'src/auth/get-user.decorator'
import { User } from 'src/user/entities/user.entity'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('리뷰')
@Controller('restaurants/:restaurantId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({ summary: '리뷰 목록 조회' })
  @ApiOkResponse({
    type: Review,
    description: '리뷰 목록 불러오기 성공했습니다.',
  })
  @ApiResponse({ status: 500, description: 'InternalServerError.' })
  @Get()
  async getAllReviews() {
    return this.reviewService.getAllReviews()
  }

  @ApiOperation({ summary: '리뷰 상세 조회' })
  @ApiOkResponse({
    type: Review,
    description: '리뷰 상세 불러오기 성공했습니다.',
  })
  @ApiParam({ name: 'id', description: '리뷰 ID' })
  @ApiResponse({ status: 500, description: 'InternalServerError.' })
  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    return this.reviewService.getReviewById(+id)
  }

  @ApiOperation({ summary: '리뷰 생성' })
  @ApiBearerAuth()
  @ApiBody({ type: ReviewDto, description: 'Review data' })
  @ApiResponse({ status: 201, description: 'created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'NotFounded.' })
  @ApiResponse({ status: 500, description: 'InternalServerError.' })
  @Post()
  @UseGuards(AuthGuard())
  async createReview(
    @Param('restaurantId') restaurantId: string,
    @Body() reviewDto: ReviewDto,
    @GetUser() user: User,
  ): Promise<object> {
    return await this.reviewService.createReview(+restaurantId, reviewDto, user)
  }

  @ApiOperation({ summary: '리뷰 수정' })
  @ApiBearerAuth()
  @ApiBody({ type: ReviewDto, description: 'Review data' })
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'NotFounded.' })
  @ApiResponse({ status: 500, description: 'InternalServerError.' })
  @Patch(':id')
  @UseGuards(AuthGuard())
  async updateReview(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() reviewDto: ReviewDto,
    @GetUser() user: User,
  ): Promise<Review> {
    return this.reviewService.updateReview(+restaurantId, +id, reviewDto, user)
  }

  @ApiOperation({ summary: '리뷰 삭제' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'NotFounded.' })
  @ApiResponse({ status: 500, description: 'InternalServerError.' })
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
