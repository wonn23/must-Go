import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { Repository } from 'typeorm'
import { User } from 'src/user/entities/user.entity'
import * as bcrypt from 'bcrypt'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UserRepository } from 'src/user/user.repository'
import { JwtService } from '@nestjs/jwt'
import { Refresh } from 'src/user/entities/refresh.entity'
import { ConfigService } from '@nestjs/config'
import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'

const mockUserRepository = {
  findByUsername: jest.fn(),
}

const mockJWT = {
  sign: jest.fn(),
}

const mockRefreshRepository = {
  findOneBy: jest.fn(),
}

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

describe('AuthService', () => {
  let service: AuthService
  let userRepository: UserRepository
  let refreshRepository: MockRepository<Refresh>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJWT },
        {
          provide: getRepositoryToken(Refresh),
          useValue: mockRefreshRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_ACCESS_TOKEN_SECRET') {
                return 'Secret1234'
              }
              if (key === 'JWT_ACCESS_TOKEN_EXPIRATION_TIME') {
                return '3600'
              }
              if (key === 'JWT_REFRESH_TOKEN_SECRET') {
                return 'Secret5678'
              }
              if (key === 'JWT_REFRESH_TOKEN_EXPIRATION_TIME') {
                return '3600'
              }
              return null
            }),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userRepository = module.get<UserRepository>(UserRepository)
    refreshRepository = module.get<MockRepository<Refresh>>(
      getRepositoryToken(Refresh),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('signin', () => {
    it('should fail because of user does not exist', async () => {
      //userRepository.findByUsername.mockResolvedValue(undefined)
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(undefined)
      try {
        const result = await service.signIn({
          username: 'test1234',
          password: '123455@!',
        })
      } catch (error) {
        //console.log(error)
        expect(error).toBeInstanceOf(UnprocessableEntityException)
      }
    })

    it('should fail because of wrong password', async () => {
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash('01012345678', salt)
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(
        (() => {
          const user = new User()
          user.id = 'test1234'
          user.username = 'testUser'
          user.password = hashedPassword
          return user
        })(),
      )
      try {
        const result = await service.signIn({
          username: 'test1234',
          password: '010123456789',
        })
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException)
      }
    })
  })
})
