import {
  Body,
  Controller,
  Post,
  HttpCode,
  Get,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { IUser } from 'src/user/types/user.interface';
import { IUserResponse } from 'src/user/types/user-response.interface';
import { LoginDto } from './dto/login.dto';
import { LoginAuth0Dto } from './dto/loginAuth0.dto';
import { ICreateUserResponse, ITokens } from './types';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ICreateUserResponse> {
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
  @UseGuards(AuthGuard)
  async userInfo(@User() user: IUser): Promise<IUserResponse> {
    return { user };
  }

  @Post('reset-password')
  @HttpCode(200)
  async initResetPassword(@Body('email') email: string) {
    this.authService.initResetPassword(email);
  }
}
