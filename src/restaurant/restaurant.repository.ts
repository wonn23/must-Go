import { Between, Repository, getRepository } from 'typeorm'
import { CustomRepository } from '../common/decorator/typeorm-ex.decorator'
import { Restaurant } from './entities/restaurant.entity'
import { statusEnum } from './types/restaurant.enum'

@CustomRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {
  async getRestaurantsInRange(query): Promise<object[]> {
    /* 쿼리로 들어온 point(lat, lon)을 기준으로 range내의 맛집들을 조회하고,
    orderBy를 기준으로 정렬, filter 기준으로 업태를 분류해서 return 하는 함수 */

    const { lat, lon, range, orderBy, filter } = query
    const latRange = this.convertRangeToDegree(range, true) // 대략적으로 1km에 0.009009도
    const lonRange = this.convertRangeToDegree(range, false) // 대략적으로 1km에 0.011236도
    const minLat = lat - latRange
    const maxLat = lat + latRange
    const minLon = lon - lonRange
    const maxLon = lon + lonRange

    const queryBuilder = this.createQueryBuilder('restaurant')
      // 사각형 범위로 필터링
      .where(`restaurant.lat::float BETWEEN ${minLat} AND ${maxLat}`)
      .andWhere(`restaurant.lon::float BETWEEN ${minLon} AND ${maxLon}`)
      .select([
        'restaurant.id as id',
        'restaurant.name_address as name_address',
        'restaurant.county_name as county_name',
        'restaurant.name as name',
        'restaurant.type as type',
        'restaurant.address as address',
        'restaurant.status as status',
        'restaurant.lat as lat',
        'restaurant.lon as lon',
        'restaurant.score as score',
        'restaurant.updated_at as updated_at',
      ])

    // 유형에 따른 필터링
    if (filter) {
      queryBuilder.andWhere(`restaurant.type = :filter`, { filter })
    }

    // 하버사인 공식을 이용한 거리 계산
    queryBuilder.addSelect(
      `6371 * acos(cos(radians(${lat})) * cos(radians(restaurant.lat::float)) * cos(radians(restaurant.lon::float) - radians(${lon})) + sin(radians(${lat})) * sin(radians(restaurant.lat::float)))`,
      'distance',
    )

    // 영업 중인 식당 필터링
    queryBuilder.andWhere(`restaurant.status = '영업'`)

    // 정렬
    if (orderBy === 'Rating') {
      queryBuilder.orderBy('restaurant.score', 'DESC')
    } else if (orderBy === 'Distance') {
      queryBuilder.orderBy('distance', 'ASC')
    }

    // 쿼리 실행
    const restaurants = await queryBuilder.getRawMany()
    return restaurants
  }

  async findRestaurantById(id: number) {
    const restaurant = await this.createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.reviews', 'review')
      .orderBy('review.createdAt', 'DESC')
      .where('restaurant.id = :id', { id })
      .getOne()
    return restaurant
  }

  convertRangeToDegree = (range: number, isLatitude: boolean): number => {
    // 대략적인 거리 변환 함수
    const degreePerKm = isLatitude ? 0.009009 : 0.011236 // 위도일 경우 1Km에 0.009009도, 경도일 경우 1Km에 0.011236도
    return range * degreePerKm
  }
}
