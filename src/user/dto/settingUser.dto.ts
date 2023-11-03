import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsString,
  MaxLength
} from 'class-validator';

// 유저 설정 업데이트 DTO
export class SettingUserDto {
  @ApiProperty({ description: '위도' })
  @IsString()
  @MaxLength(20)
  lat: string;

  @ApiProperty({ description: '경도' })
  @IsString()
  @MaxLength(20)
  lon: string;

  @ApiProperty({ description: '점심 추천 서비스 이용 여부' })
  @IsBoolean()
  lunchServiceYn: boolean;

}