import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common'

@Injectable()
export class RestaurantValidationPipe implements PipeTransform {
  readonly orderByOptions = ['Distance', 'Rating']
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') throw new Error('잘못된 파라미터입니다.')

    const { lat, lon, range, orderBy } = value
    if (!lat) {
      throw new BadRequestException('lat은 필수 파라미터입니다.')
    }

    if (!lon) {
      throw new BadRequestException('lon은 필수 파라미터입니다.')
    }

    if (!range || isNaN(Number(range))) {
      throw new BadRequestException(
        'range는 소숫점 형태의 필수 파라미터입니다.',
      )
    }

    if (orderBy && !this.orderByOptions.includes(orderBy)) {
      throw new BadRequestException(
        `정렬 옵션은 ${this.orderByOptions.join(', ')} 중 하나여야 합니다.`,
      )
    }
    value.orderBy = orderBy || 'Distance'
    value.lat = Number(lat)
    value.lon = Number(lon)
    value.range = Number(range)

    return value
  }
}
