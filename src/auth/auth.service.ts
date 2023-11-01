import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { SignInDto } from './dto/signin.dto'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    try {
      const { username, password } = signInDto

      const user = await this.usersRepository.findOne({ where: { username } })

      if (!user) throw new UnprocessableEntityException('해당 유저가 없습니다.')

      const isAuth = await bcrypt.compare(password, user.password)

      if (!isAuth) throw new UnauthorizedException('비밀번호가 틀렸습니다.')

      const payload = { username: user.username }
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPORESIN'),
      })

      return { accessToken }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }
}
