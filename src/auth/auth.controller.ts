import {
  Body,
  Controller,
  Post,
  HttpCode,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { IUser } from 'src/user/types/user.interface';
import { IUserResponse } from 'src/user/types/user-response.interface';
import { LoginDto } from './dto/login.dto';
import { LoginAuth0Dto } from './dto/loginAuth0.dto';
import { ITokens } from './types';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<ITokens> {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<ITokens> {
    return this.authService.login(loginDto);
  }

  @Post('login-auth0')
  @HttpCode(200)
  async loginAuth0(@Body() loginAuth0Dto: LoginAuth0Dto): Promise<ITokens> {
    return this.authService.loginAuth0(loginAuth0Dto);
  }

  @Get('me')
  async userInfo(@User() user: IUser): Promise<IUserResponse> {
    if (!user) {
      throw new UnauthorizedException();
    }

    return { user };
  }
}
