import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { ReviewService } from './review.service'

// mock 데이터
const mockReviewRepository = {
  createReview: jest.fn(),
  getAllReviews: jest.fn(),
  getReviewById: jest.fn(),
  updateReview: jest.fn(),
  deleteReview: jest.fn(),
}
const mockJwtService = {
  sign: jest.fn(),
}

//1. test suite 생성
describe('ReviewService', () => {
  let reviewService: ReviewService
  //2. 테스팅 모듈 생성
  //beforeEach 메소드는 테스트블록이 실행되기 직전에 매번 실행된다.(초기화 목적)
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile()

    reviewService = moduleRef.get<ReviewService>(ReviewService)
  })

  describe('findAll', () => {
    it('test', () => {
      expect(1 + 1).toBe(2)
    })
  })
})
