import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { IdValidationPipe } from 'src/pipes/idValidationPipe';
import { User } from 'src/decorators/user.decorator';
import { PageDto } from 'src/pagination/dto/page.dto';
import { PageOptionsDto } from 'src/pagination/dto/page-options.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { IMessage } from 'src/types';
import { IUserResponse } from './types/user-response.interface';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users list' })
  @Get('list')
  @UseGuards(AuthGuard)
  async getAllUsers(
    @Query() query: PageOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    return this.userService.getAllUsers(query);
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @Get(':id')
  @UseGuards(AuthGuard)
  async findUserById(
    @Param('id', IdValidationPipe) userId: number,
  ): Promise<IUserResponse> {
    return this.userService.findUserById(userId);
  }

  @ApiOperation({ summary: 'Update user by ID' })
  @Patch(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async updateUser(
    @User('id') userId: number,
    @Param('id', IdValidationPipe) userIdToUpdate: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    return this.userService.updateUser(userId, userIdToUpdate, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user by ID' })
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(
    @User('id') userId: number,
    @Param('id', IdValidationPipe) userIdToDelete: number,
  ): Promise<IMessage> {
    return this.userService.deleteUser(userId, userIdToDelete);
  }
}
