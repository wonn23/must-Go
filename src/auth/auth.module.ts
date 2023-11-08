import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'
import { JwtRefreshTokenStrategy } from './jwt-refresh.strategy'
import { UserRepository } from 'src/user/user.repository'
import { TypeOrmExModule } from 'src/common/decorator/typeoprm-ex.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Refresh } from 'src/user/entities/refresh.entity'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    TypeOrmModule.forFeature([Refresh]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
