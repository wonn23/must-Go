import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Request,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/signin.dto'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signIn(@Body(ValidationPipe) signInDto: SignInDto): Promise<object> {
    return this.authService.signIn(signInDto)
  }

  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Get('/refresh')
  getRefreshToken(@Request() req): Promise<{ accessToken: string }> {
    return this.authService.getNewAccessToken(req.user)
  }
}
