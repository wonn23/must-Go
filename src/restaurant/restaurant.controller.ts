import { Controller, Get, Query, UsePipes } from '@nestjs/common'
import { RestaurantService } from './restaurant.service'
import { ScheduleService } from './schedule.service'
import { RestaurantValidationPipe } from './pipes/restaurantValidation.pipe'
import { getRestaurantDto } from './dto/get-restaurant.dto'

@Controller('restaurants')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService, // private readonly scheduleService: ScheduleService,
  ) {}
  // @Get()
  // async getRestaurantData() {
  //   return await this.scheduleService.getRestaurantData()
  // }

  @Get()
  @UsePipes(new RestaurantValidationPipe())
  async getAllRestaurants(@Query() query: getRestaurantDto) {
    return await this.restaurantService.getAllRestaurants(query)
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.restaurantService.findOne(+id)
  // }
}
