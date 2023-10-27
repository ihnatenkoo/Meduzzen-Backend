import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PageDto } from 'src/pagination/dto/page.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PageOptionsDto } from 'src/pagination/dto/page-options.dto';
import { IUser } from './types/user.interface';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.userService.createUser(createUserDto);
  }

  @Get('list')
  async getAllUsers(
    @Query() query: PageOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    return this.userService.getAllUsers(query);
  }

  @Get(':id')
  async findUserById(@Param('id') userId: number): Promise<IUser> {
    return this.userService.findUserById(userId);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: number): Promise<IUser> {
    return this.userService.deleteUser(userId);
  }
}
