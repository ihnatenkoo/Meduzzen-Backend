import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { PageDto } from 'src/pagination/dto/page.dto';
import { PageOptionsDto } from 'src/pagination/dto/page-options.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { IUserResponse } from './types/user-response.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  async getAllUsers(
    @Query() query: PageOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    return this.userService.getAllUsers(query);
  }

  @Get(':id')
  async findUserById(@Param('id') userId: number): Promise<IUserResponse> {
    return this.userService.findUserById(userId);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(
    @User('id') userId: number,
    @Param('id') userIdToDelete: string,
  ): Promise<{ message: string }> {
    return this.userService.deleteUser(userId, Number(userIdToDelete));
  }
}
