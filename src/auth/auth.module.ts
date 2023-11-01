import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
