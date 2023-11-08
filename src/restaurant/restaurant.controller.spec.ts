import { Test, TestingModule } from '@nestjs/testing'
import { RestaurantController } from './restaurant.controller'
import { RestaurantService } from './restaurant.service'

describe('RestaurantController', () => {
  let controller: RestaurantController

  const mockRestaurantService = {
    getRestaurat: jest.fn((id) => {
      return {
        id: id,
      }
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [RestaurantService],
    })
      .overrideProvider(RestaurantService)
      .useValue(mockRestaurantService)
      .compile()

    controller = module.get<RestaurantController>(RestaurantController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getRestaurantById', () => {
    it('맛집 하나 return하고 리뷰들이 join되어있음', async () => {})
  })
})
