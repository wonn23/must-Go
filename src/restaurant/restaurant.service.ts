import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { RestaurantRepository } from './restaurant.repository'
import { Logger } from '@nestjs/common'
import { GetRestaurantDto } from './dto/get-restaurant.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ReviewRepository } from 'src/review/review.repository'
import { Restaurant } from './entities/restaurant.entity'
// import { CreateRestaurantDto } from './dto/create-restaurant.dto'
// import { UpdateRestaurantDto } from './dto/update-restaurant.dto'
import { ICACHE_SERVICE } from 'src/common/provider.constant'
import { CacheService } from 'src/cache/cache.service'

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name)

  constructor(
    @InjectRepository(RestaurantRepository)
    private restaurantRepository: RestaurantRepository,
    @Inject(ICACHE_SERVICE)
    private readonly cacheService: CacheService,
  ) {}

  async getRestaurantsInRange(query: GetRestaurantDto): Promise<object[]> {
    // range 내 식당과 거리 정보를 반환하는 함수.
    try {
      const restaurants =
        await this.restaurantRepository.getRestaurantsInRange(query)
      const range = query.range
      const filteredRestaurants = []

      /* Repository에서 반환된 맛집들 중 range(km)내의 맛집들만 배열에 담아줍니다.
        처음에 사각형 범위로 필터링을 진행했기 때문에, 실제 지정된 범위를 벗어날 수 있습니다.
        그래서 여기에서 한 번 더 필터링을 진행합니다.*/
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

  async getRestaurantById(id: number) {
    const cacheKey = `RestaurantId:${id}`
    const restaurant = await this.cacheService.getFromCache(cacheKey)

    if (restaurant) return { restaurant }

    try {
      const result = await this.restaurantRepository.findRestaurantById(id)

      await this.cacheService.setCache(cacheKey, result, 3600) // Cache for 1 hour

      return { result }
    } catch (error) {
      throw new InternalServerErrorException(
        '해당 리뷰를 불러오는데 실패했습니다.',
      )
    }
  }
}
