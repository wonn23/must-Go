import { Controller, Get, Query, UsePipes, UseGuards } from '@nestjs/common'
import { RestaurantService } from './restaurant.service'
import { ScheduleService } from './schedule.service'
import { RestaurantValidationPipe } from './pipes/restaurantValidation.pipe'
import { RestaurantDto, GetRestaurantDto } from './dto/get-restaurant.dto'
import { ApiOperation, ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

@ApiTags('맛집')
@Controller('restaurants')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService, // private readonly scheduleService: ScheduleService,
  ) {}
  // @Get()
  // async getRestaurantData() {
  //   return await this.scheduleService.getRestaurantData()
  // }

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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.restaurantService.findOne(+id)
  // }
}
