import {
  Controller,
  Get,
  Query,
  UsePipes,
  UseGuards,
  Param,
} from '@nestjs/common'
import { RestaurantService } from './restaurant.service'
import { ScheduleService } from './schedule.service'
import { RestaurantValidationPipe } from './pipes/restaurantValidation.pipe'
import { RestaurantDto, GetRestaurantDto } from './dto/get-restaurant.dto'
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiOkResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { Restaurant } from './entities/restaurant.entity'

@ApiBearerAuth()
@ApiTags('맛집')
@Controller('restaurants')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly scheduleService: ScheduleService,
  ) {}

  @ApiOperation({ summary: '설정 지역 범위 내 맛집 조회' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: RestaurantDto,
  })
  @Get()
  @UseGuards(AuthGuard())
  @UsePipes(new RestaurantValidationPipe())
  async getRestaurantsInRange(@Query() query: GetRestaurantDto) {
    return await this.restaurantService.getRestaurantsInRange(query)
  }

  @ApiOperation({ summary: '맛집 상세 조회' })
  @ApiOkResponse({
    type: Restaurant,
    description: '맛집 상세 불러오기 성공했습니다.',
  })
  @ApiParam({ name: 'id', description: '맛집 ID' })
  @ApiBadRequestResponse({ description: 'BadRequest' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError.' })
  @Get(':id')
  async getRestaurantById(@Param('id') id: string) {
    return await this.restaurantService.getRestaurantById(+id)
  }
}
