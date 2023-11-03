import { Controller, Get, Query } from '@nestjs/common'
import { RegionService } from './region.service'

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get()
  getKoreaRegion(
    @Query('dosi') dosi: string,
    @Query('sgg') sgg: string,
  ): object[] {
    return this.regionService.getKoreaRegion(dosi, sgg)
  }
}
