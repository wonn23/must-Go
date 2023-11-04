import { IsInt, IsString, Max, Min, MinLength } from 'class-validator'

export class ReviewDto {
  @IsInt({ message: '별점은 정수입니다.' })
  @Min(0, { message: '스코어는 0 이상이어야 합니다.' })
  @Max(5, { message: '스코어는 5 이하여야 합니다.' })
  score: number

  @IsString()
  @MinLength(3, { message: '리뷰 내용은 최소 5글자 이상이어야 합니다.' })
  content: string
}
