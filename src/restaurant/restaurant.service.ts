import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { RestaurantRepository } from './restaurant.repository'
import { Logger } from '@nestjs/common'
import { GetRestaurantDto } from './dto/get-restaurant.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ReviewRepository } from 'src/review/review.repository'
import { Restaurant } from './entities/restaurant.entity'
// import { CreateRestaurantDto } from './dto/create-restaurant.dto'
// import { UpdateRestaurantDto } from './dto/update-restaurant.dto'

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name)

  constructor(
    @InjectRepository(RestaurantRepository)
    private restaurantRepository: RestaurantRepository,
  ) {}

  async getRestaurantsInRange(query: GetRestaurantDto): Promise<object[]> {
    // range 내 식당과 거리 정보를 반환하는 함수.
    try {
      const restaurants =
        await this.restaurantRepository.getRestaurantsInRange(query)
      const { range } = query
      const filteredRestaurants = []

      for (let restaurant of restaurants) {
        if (restaurant['distance'] <= range) {
          filteredRestaurants.push(restaurant)
        }
      }

      return filteredRestaurants
    } catch (error) {
      this.logger.error(`${error}`)
      throw new InternalServerErrorException(
        '맛집 목록을 가져오는 데 실패했습니다.',
      )
    }
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  private latLonToKm(point1: number[], point2: number[]): number {
    // point 간 거리를 계산하는 함수.
    const lat1 = point1[1]
    const lon1 = point1[0]
    const lat2 = point2[1]
    const lon2 = point2[0]

    const R = 6371 // km
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)

    const radLat1 = this.toRadians(lat1)
    const radLat2 = this.toRadians(lat2)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(radLat1) *
        Math.cos(radLat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  async getRestaurantById(id: number) {
    try {
      return await this.restaurantRepository.findRestaurantById(id)
    } catch (error) {
      throw new InternalServerErrorException(
        '해당 리뷰를 불러오는데 실패했습니다.',
      )
    }
  }
}
