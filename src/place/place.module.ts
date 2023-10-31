import { Module } from '@nestjs/common'
import { PlaceService } from './place.service'
import { PlaceController } from './place.controller'
import { HttpModule } from '@nestjs/axios/dist'
import { ScheduleService } from './schedule.service'

@Module({
  imports: [HttpModule],
  controllers: [PlaceController],
  providers: [PlaceService, ScheduleService],
})
export class PlaceModule {}
