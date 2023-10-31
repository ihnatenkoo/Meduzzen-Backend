import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/pagination/dto/page-options.dto';
import { PageDto } from 'src/pagination/dto/page.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { IUserResponse } from './types/user-response.interface';
import { IMessage } from 'src/types';
import { UserEntity } from './user.entity';
import { paginate } from 'src/pagination/paginate';
import { ACCESS_DENIED, USER_NOT_FOUND } from 'src/constants';

@Injectable()
export class UserService {
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
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    const { user: existedUser } = await this.findUserById(userId);
    const updatedUser = this.userRepository.merge(existedUser, updateUserDto);
    const user = await this.userRepository.save(updatedUser);

    return { user };
  }

  async deleteUser(userId: number, userIdToDelete: number): Promise<IMessage> {
    if (userId !== userIdToDelete) {
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    const { user } = await this.findUserById(userId);
    await this.userRepository.delete(userId);

    return { message: `User id:${user.id} deleted successfully` };
  }
}
