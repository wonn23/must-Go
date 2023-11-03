import { IsOptional, IsString, IsIn } from 'class-validator'

export class getRestaurantDto {
  @IsOptional()
  range: number
  @IsOptional()
  lat: number
  @IsOptional()
  lon: number

  @IsOptional()
  @IsString()
  @IsIn(['Distance', 'Rating'])
  orderBy: string

  @IsOptional()
  @IsString()
  filter: string
}
