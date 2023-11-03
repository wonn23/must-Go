import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator'

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
}
