import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/pagination/dto/page-options.dto';
import { PageDto } from 'src/pagination/dto/page.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { IUserResponse } from './types/user-response.interface';
import { IMessage } from 'src/types';
import { UserEntity } from './user.entity';
import { paginate } from 'src/pagination/paginate';
import {
  ACCESS_DENIED,
  USER_DELETED_SUCCESSFULLY,
  USER_NOT_FOUND,
} from 'src/constants';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUserById(id: number): Promise<IUserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return { user };
  }

  async getAllUsers(query: PageOptionsDto): Promise<PageDto<UserEntity>> {
    return paginate<UserEntity>({
      name: 'user',
      orderBy: 'user.id',
      query,
      repository: this.userRepository,
    });
  }

  async updateUser(
    userId: number,
    userIdToUpdate: number,
    updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    if (userId !== userIdToUpdate) {
      this.logger.error(
        `Access denied! User id: ${userId} try to update user id:${userIdToUpdate}`,
      );

      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    const { user } = await this.findUserById(userId);
    this.userRepository.merge(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    this.logger.log(`User ${updatedUser.email} updated successfully`);

    return { user: updatedUser };
  }

  async deleteUser(userId: number, userIdToDelete: number): Promise<IMessage> {
    if (userId !== userIdToDelete) {
      this.logger.error(
        `Access denied! User id: ${userId} try to delete user id:${userIdToDelete}`,
      );

      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    const { user } = await this.findUserById(userId);
    await this.userRepository.delete(userId);

    this.logger.log(`${USER_DELETED_SUCCESSFULLY}. Email: ${user.email}`);

    return { message: USER_DELETED_SUCCESSFULLY };
  }
}
