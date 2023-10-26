import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { IUser } from './types/user.interface';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  async findUserById(@Param('id') userId: number): Promise<IUser> {
    return this.userService.findUserById(userId);
  }

  @Get('list')
  async getAllUsers(): Promise<IUser[]> {
    return this.userService.getAllUsers();
  }

  @Patch(':id')
  async updateUser(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    return this.userService.updateUser(userId, updateUserDto);
  }
}
