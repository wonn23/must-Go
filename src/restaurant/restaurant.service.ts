import { Injectable } from '@nestjs/common'
import { RestaurantRepository } from './restaurant.repository'
import { Logger } from '@nestjs/common'
import { getRestaurantDto } from './dto/get-restaurant.dto'
// import { CreateRestaurantDto } from './dto/create-restaurant.dto'
// import { UpdateRestaurantDto } from './dto/update-restaurant.dto'

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name)

  constructor(private restaurantRepository: RestaurantRepository) {}
  // create(createRestaurantDto: CreateRestaurantDto) {
  //   return 'This action adds a new restaurant'
  // }

  async getAllRestaurants(query: getRestaurantDto): Promise<object> {
    try {
      const restaurants = await this.restaurantRepository.findAll(query)
      const { lat, lon, range, orderBy } = query
      const point1 = [lon, lat] // 쿼리로 받아온 위치
      const filteredRestaurants = []
      console.log(restaurants.length)

      for (let restaurant of restaurants) {
        let lat2 = restaurant.lat
        let lon2 = restaurant.lon
        let point2 = [lon2, lat2] // 식당의 위치
        const distance = this.latLonToKm(point1, point2)
        if (distance <= range) {
          // console.log(restaurant.name, distance)
          const restaurantWithDistance = { ...restaurant, distance }
          filteredRestaurants.push(restaurantWithDistance)
        }
      }

      if (orderBy === 'Rating') {
        filteredRestaurants.sort((a, b) => b.score - a.score) // 평점 내림차순 정렬
      } else if (orderBy === 'Distance') {
        filteredRestaurants.sort((a, b) => a.distance - b.distance) // 거리 오름차순 정렬
      }

      console.log(filteredRestaurants.length)
      return filteredRestaurants
    } catch (error) {
      console.log(error)
    }
  }

  private toRadians(degrees) {
    return degrees * (Math.PI / 180)
  }

  private latLonToKm(point1, point2) {
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

  // findOne(id: number) {
  //   return `This action returns a #${id} restaurant`
  // }

  // update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
  //   return `This action updates a #${id} restaurant`
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} restaurant`
  // }
}
