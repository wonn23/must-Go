import { Between, Repository, getRepository } from 'typeorm'
import { CustomRepository } from '../common/decorator/typeorm-ex.decorator'
import { Restaurant } from './entities/restaurant.entity'
import { statusEnum } from './types/restaurant.enum'

@CustomRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {
  async getRestaurantsInRange(query): Promise<object[]> {
    const { lat, lon, range, orderBy, filter } = query
    const latRange: number = range * 0.009009 // 대략적으로 1km에 0.009009도
    const lonRange: number = range * 0.011236 // 대략적으로 1km에 0.011236도
    const minLat: number = lat - latRange
    const maxLat: number = lat + latRange
    const minLon: number = lon - lonRange
    const maxLon: number = lon + lonRange

    const queryBuilder = this.createQueryBuilder('restaurant')
      // 사각형 범위로 필터링
      .where(`lat::float BETWEEN ${minLat} AND ${maxLat}`)
      .andWhere(`lon::float BETWEEN ${minLon} AND ${maxLon}`)

    // 유형에 따른 필터링
    if (filter) {
      queryBuilder.andWhere(`restaurant.type = :filter`, { filter })
    }

    // 하버사인 공식을 이용한 거리 계산
    queryBuilder.addSelect(
      `6371 * acos(cos(radians(${lat})) * cos(radians(restaurant.lat::float)) * cos(radians(restaurant.lon::float) - radians(${lon})) + sin(radians(${lat})) * sin(radians(restaurant.lat::float)))`,
      'distance',
    )

    // status가 '영업'인 식당만 필터링
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
}
