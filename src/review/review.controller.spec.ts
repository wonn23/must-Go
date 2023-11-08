import { Test, TestingModule } from '@nestjs/testing'
import { ReviewController } from './review.controller'
import { ReviewService } from './review.service'
import { Review } from './entities/review.entity'
import { NotFoundException } from '@nestjs/common'
import { ReviewDto } from './dto/review.dto'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'

// reviewController에서 return에 있는 reviewService mockReviewService로 모의 함수 생성
// 모의로 생성, 수정, 삭제될 리뷰 엔터티

const mockReviewService = {
  createReview: jest.fn(),
  getAllReviews: jest.fn(),
  getReviewById: jest.fn(),
  updateReview: jest.fn(),
  deleteReview: jest.fn(),
}

const mockReviewEntity = {
  id: 1,
  score: 5,
  content: '여기 맛집입니다',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
}

const mockUserEntity = {
  id: 1,
  username: 'wonn22',
  lat: '127',
  lon: '53',
  lunchServiceYn: false,
}

//1. test suite 생성
describe('ReviewController', () => {
  let reviewController: ReviewController
  //2. 테스팅 모듈 생성
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        ReviewDto,
        { provide: ReviewService, useValue: mockReviewService },
        { provide: Review, useValue: mockReviewEntity },
        { provide: User, useValue: mockUserEntity },
      ],
    }).compile()

    reviewController = module.get<ReviewController>(ReviewController)
  })

  it('should be defined', () => {
    expect(reviewController).toBeDefined()
  })

  describe('getAllReviews', () => {
    it('should return an array of reviews', async () => {
      const result = [mockReviewEntity, mockReviewEntity]
      jest.spyOn(mockReviewService, 'getAllReviews').mockResolvedValue(result)

      expect(await reviewController.getAllReviews()).toBe(result)
    })
  })

  describe('getReviewById', () => {
    it('should return a single review when the review is found', async () => {
      const result = [mockReviewEntity]

      // 특정한 id 값으로 호출될 때 결과 반환하도록 모킹
      jest
        .spyOn(mockReviewService, 'getReviewById')
        .mockImplementation(async (id) => {
          if (String(id) === '1') {
            return result
          }
          // 다른 id 값에 대해서는 원하는 결과를 반환하도록 설정
          // 예를 들어, 다른 id 값에 대해서도 결과가 있는 경우
          // return [anotherMockReviewEntity];
          throw new NotFoundException()
        })
      expect(await reviewController.getReviewById('1')).toBe(result)
    })

    it('should throw NotFoundException if review is not found', () => {
      const result = [mockReviewEntity]
      jest
        .spyOn(mockReviewService, 'getReviewById')
        .mockImplementation(async (id) => {
          if (String(id) === '1') {
            return result
          }
          // 다른 id 값에 대해서는 원하는 결과를 반환하도록 설정
          // 예를 들어, 다른 id 값에 대해서도 결과가 있는 경우
          // return [anotherMockReviewEntity];
          throw new NotFoundException()
        })

      return expect(reviewController.getReviewById('999')).rejects.toThrowError(
        NotFoundException,
      )
    })
  })

  // Add similar test cases for createReview, updateReview, and deleteReview

  // describe('createReview', () => {
  //   it('should create a new review', async () => {
  //     const result = [mockReviewEntity]
  //     const restaurantId = '1'
  //     let reviewDto: ReviewDto
  //     jest
  //       .spyOn(mockReviewService, 'createReview')
  //       .mockResolvedValue(async (id, dto, user) => {
  //         return result
  //       })

  //     return expect(
  //       reviewController.createReview(restaurantId, reviewDto, mockUserEntity),
  //     ).toBe(result)
  //   })
  // })

  // describe('updateReview', () => {
  //   it('should update an existing review', async () => {
  //     const reviewDto: ReviewDto = {
  //       score: 5,
  //       content: '여기는 맛집입니다.',
  //     }
  //     const user: User = userMockData

  //     const mockReview: Review = {
  //       id: 1,
  //       score: reviewDto.score,
  //       content: reviewDto.content,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //       user: user,
  //       restaurant: {
  //         id: 1,
  //         nameAddress: 'asd',
  //         countyName: 'asd',
  //         name: 'asd',
  //         type: 'asd',
  //         address: 'asd',
  //         status: null,
  //         lat: '127',
  //         lon: '53',
  //         score: 5,
  //         updatedAt: new Date(),
  //         reviews: [],
  //         hasId: null,
  //         save: null,
  //         remove: null,
  //         softRemove: null,
  //         recover: null,
  //         reload: null,
  //       },
  //       hasId: null,
  //       save: null,
  //       remove: null,
  //       softRemove: null,
  //       recover: null,
  //       reload: null,
  //     }

  //     jest.spyOn(reviewService, 'updateReview').mockResolvedValue(mockReview)

  //     expect(
  //       await reviewController.updateReview('1', '2', reviewDto, user),
  //     ).toBe(mockReview)
  //   })
  // })

  // describe('deleteReview', () => {
  //   it('should delete an existing review', async () => {
  //     const user: User = {
  //       id: '202311040001',
  //       username: 'wonn22',
  //       password: 'qweqwqw123123e!!!!',
  //       lat: '127',
  //       lon: '53',
  //       lunchServiceYn: false,
  //       reviews: [],
  //       refresh: {
  //         id: null,
  //         hasId: null,
  //         token: 'sdf',
  //         save: null,
  //         remove: null,
  //         softRemove: null,
  //         recover: null,
  //         reload: null,
  //       },
  //       hasId: null,
  //       save: null,
  //       remove: null,
  //       softRemove: null,
  //       recover: null,
  //       reload: null,
  //     }

  //     jest.spyOn(reviewService, 'deleteReview').mockResolvedValue()

  //     await expect(
  //       reviewController.deleteReview('1', '2', user),
  //     ).resolves.not.toThrow()
  //   })
  // })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
