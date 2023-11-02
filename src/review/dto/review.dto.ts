import { IsNumber, IsString, Max, Min, MinLength } from 'class-validator'

export class ReviewDto {
  @IsNumber()
  @Min(0, { message: '스코어는 0 이상이어야 합니다.' })
  @Max(5, { message: '스코어는 5 이하여야 합니다.' })
  score: number

  @IsString()
  @MinLength(3, { message: '리뷰 제목은 최소 5글자 이상이어야 합니다.' })
  content: string
}
