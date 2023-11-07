import { Controller, Get, Query } from '@nestjs/common'
import { RegionService } from './region.service'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('시군구')
@UseGuards(AuthGuard())
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @ApiOperation({
    summary: '시군구 조회',
    description: '대한민국 시군구 지역의 데이터를 조회합니다.',
  })
  @ApiQuery({
    name: 'dosi',
    required: false,
    description: '검색할 도시',
    example: '강원도',
  })
  @ApiQuery({
    name: 'sgg',
    required: false,
    description: '검색할 시군구',
    example: '강릉시',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'InternalServerError.' })
  @Get()
  getKoreaRegion(
    @Query('dosi') dosi: string,
    @Query('sgg') sgg: string,
  ): Promise<object[]> {
    return this.regionService.getKoreaRegion(dosi, sgg)
  }
}
