import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { IUser } from './types/user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  async findUserById(@Param('id') userId: string): Promise<IUser> {
    return this.userService.findUserById(Number(userId));
  }

  @Get('list')
  async getAllUsers(): Promise<IUser[]> {
    return this.userService.getAllUsers();
  }
}
