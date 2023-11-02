import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'
import { UserRepository } from 'src/user/user.repository'
import { TypeOrmExModule } from 'src/common/decorator/typeoprm-ex.module'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        expiresIn: Number(configService.get<string>('JWT_EXPORESIN')),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
