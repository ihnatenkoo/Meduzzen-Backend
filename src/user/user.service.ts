import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/pagination/dto/page-options.dto';
import { PageMetaDto } from 'src/pagination/dto/page-meta.dto';
import { PageDto } from 'src/pagination/dto/page.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { IUserResponse } from './types/user-response.interface';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const findByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (findByEmail) {
      throw new HttpException(
        'User already signed up',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const hashPassword = await hash(createUserDto.password, 10);

    const user = await this.userRepository.save({
      ...createUserDto,
      password: hashPassword,
    });

    return { user };
  }

  async findUserById(id: number): Promise<IUserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { user };
  }

  async getAllUsers({
    page,
    limit,
    sort,
  }: PageOptionsDto): Promise<PageDto<UserEntity>> {
    const pageOptionsDto = new PageOptionsDto(page, limit, sort);

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder
      .orderBy('user.id', pageOptionsDto.sort)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    const { user: userById } = await this.findUserById(userId);
    const { name, avatar, bio } = updateUserDto;

    const updatedUser = this.userRepository.merge(userById, {
      name,
      avatar,
      bio,
    });

    const user = await this.userRepository.save(updatedUser);

    return { user };
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    const { user } = await this.findUserById(userId);
    await this.userRepository.delete(userId);

    return { message: `User id:${user.id} deleted successfully` };
  }
}
