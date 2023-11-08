import { Test, TestingModule } from '@nestjs/testing'
import { RestaurantService } from '../restaurant.service'
import { RestaurantRepository } from '../restaurant.repository'
import { GetRestaurantDto } from '../dto/get-restaurant.dto'

describe('RestaurantService', () => {
  let service: RestaurantService
  let repository: RestaurantRepository

  beforeEach(async () => {
    // 각 테스트가 실행되기 전에 테스트에 필요한 서비스와 레포지토리 설정
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: RestaurantRepository,
          useFactory: () => ({
            getRestaurantsInRange: jest.fn(),
            findRestaurantById: jest.fn(),
          }),
        },
      ],
    }).compile()

    service = module.get<RestaurantService>(RestaurantService)
    repository = module.get<RestaurantRepository>(RestaurantRepository)
  })

  it('should be defined', () => {
    // RestaurantService가 제대로 정의되었는지 확인
    expect(service).toBeDefined()
  })

  describe('getRestaurantsInRange', () => {
    it('should return restaurants in range', async () => {
      const dto: GetRestaurantDto = {
        lat: 1,
        lon: 1,
        range: 1,
        orderBy: 'Distance',
        filter: '중국식',
      }
      const mockResult = [
        {
          id: 1,
          nameAddress: 'Test Restaurant, Seoul',
          countyName: 'Seoul',
          name: 'Test Restaurant',
          type: '중국식',
          address: 'Seoul, Korea',
          status: '영업',
          lat: '1',
          lon: '1',
          score: 4.5,
          updatedAt: '2023-01-01T00:00:00Z',
          distance: 0.5,
        },
        {
          id: 2,
          nameAddress: 'Test Restaurant 2, Seoul',
          countyName: 'Seoul',
          name: 'Test Restaurant 2',
          type: '중국식',
          address: 'Seoul, Korea',
          status: '영업',
          lat: '1',
          lon: '1',
          score: 4.5,
          updatedAt: '2023-01-01T00:00:00Z',
          distance: 1.5, // range 밖에 있는 식당
        },
      ]

      const expectedResult = [mockResult[0]] // range 내에 있는 식당만 반환되어야 합니다.
      // 메소드가 테스트 데이터를 반환하도록 설정
      jest
        .spyOn(repository, 'getRestaurantsInRange')
        .mockResolvedValue(mockResult)

      // 메소드가 제대로 동작하는지 확인
      expect(await service.getRestaurantsInRange(dto)).toEqual(expectedResult)
    })
  })
})
