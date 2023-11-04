import {
  Body,
  Controller,
  Post,
  HttpCode,
  Get,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { IUserResponse } from 'src/user/types';
import { LoginDto } from './dto/login.dto';
import { LoginAuth0Dto } from './dto/loginAuth0.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { IMessage } from 'src/types';
import { ICreateUserResponse, ITokens } from './types';
import { AuthService } from './auth.service';
import { UserEntity } from 'src/user/user.entity';
import { InitResetPasswordDto } from './dto/initResetPassword.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get information about authorized user',
  })
  @Get('me')
  @UseGuards(AuthGuard)
  async userInfo(@User() user: UserEntity): Promise<IUserResponse> {
    return { user };
  }

  @ApiOperation({
    summary: 'Register in the app',
  })
  @Post('register')
  @UsePipes(new DtoValidationPipe())
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ICreateUserResponse> {
    return this.authService.createUser(createUserDto);
  }

  @ApiOperation({
    summary: 'Login to the app',
  })
  @Post('login')
  @UsePipes(new DtoValidationPipe())
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<ITokens> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'Login to the app using Auth0 service',
  })
  @Post('login-auth0')
  @HttpCode(200)
  async loginAuth0(@Body() loginAuth0Dto: LoginAuth0Dto): Promise<ITokens> {
    return this.authService.loginAuth0(loginAuth0Dto);
  }

  @ApiOperation({
    summary: 'Request email for reset password',
  })
  @Post('init-reset-password')
  @HttpCode(200)
  @UsePipes(new DtoValidationPipe())
  async initResetPassword(
    @Body() { email }: InitResetPasswordDto,
  ): Promise<IMessage> {
    return this.authService.initResetPassword(email);
  }

  @ApiOperation({
    summary: 'Reset password by clicking on the confirmation link in the email',
  })
  @Post('reset-password')
  @HttpCode(200)
  @UsePipes(new DtoValidationPipe())
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<IMessage> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
