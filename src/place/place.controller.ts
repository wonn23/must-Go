import { Controller, Get, Param } from '@nestjs/common'
import { PlaceService } from './place.service'
import { ScheduleService } from './schedule.service'

@Controller('place')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private readonly scheduleService: ScheduleService,
  ) {}
  @Get()
  getPlaceData() {
    return this.scheduleService.getPlaceData()
  }

  @Get()
  findAll() {
    return this.placeService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placeService.findOne(+id)
  }
}
