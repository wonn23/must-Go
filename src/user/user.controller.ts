import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/registerUser.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { User } from './entities/user.entity'
import { AuthGuard } from '@nestjs/passport'

@ApiTags('유저')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post('/signup')
  signUp(
    @Body(ValidationPipe) registerUserDto: RegisterUserDto,
  ): Promise<object> {
    return this.userService.signUp(registerUserDto)
  }

  @Get('/info')
  @UseGuards(AuthGuard())
  getUserInfo(@Request() req): Promise<User> {
    return this.userService.getUserInfo(req.user)
  }
}
