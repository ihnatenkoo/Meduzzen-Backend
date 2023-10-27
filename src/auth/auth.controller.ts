import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { AuthService } from './auth.service';
import { ITokens } from './types';
import { LoginDto } from './dto/login.dto';

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
}
