import { IsOptional, IsString, IsIn } from 'class-validator'
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'

@ApiExtraModels()
export class GetRestaurantDto {
  @ApiProperty({ required: true, type: Number, description: '범위 (km)' })
  @IsOptional()
  range: number

  @ApiProperty({ required: true, type: Number, description: '위도' })
  @IsOptional()
  lat: number

  @ApiProperty({ required: true, type: Number, description: '경도' })
  @IsOptional()
  lon: number

  @ApiProperty({
    required: false,
    enum: ['Distance', 'Rating'],
    type: String,
    description: '정렬 순서 (default: Distance)',
  })
  @IsOptional()
  @IsString()
  @IsIn(['Distance', 'Rating'])
  orderBy: string

  @ApiProperty({
    required: false,
    enum: ['일식', '중국식', '김밥(도시락)'],
    type: String,
    description: '필터 (옵션)',
  })
  @IsOptional()
  @IsString()
  filter: string
}

export class RestaurantDto {
  @ApiProperty()
  id: number
  @ApiProperty()
  nameAddress: string
  @ApiProperty()
  countyName: string
  @ApiProperty()
  name: string
  @ApiProperty()
  type: string
  @ApiProperty()
  address: string
  @ApiProperty()
  status: string
  @ApiProperty()
  lat: string
  @ApiProperty()
  lon: string
  @ApiProperty()
  score: number
  @ApiProperty()
  updatedAt: string
  @ApiProperty()
  distance: number
}
