import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { IUser } from './types/user.interface';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
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
    const newUser = { ...createUserDto, password: hashPassword };

    return this.userRepository.save(newUser);
  }

  async findUserById(id: number): Promise<IUser> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    return this.userRepository.find();
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    const user = await this.findUserById(userId);
    const { name, avatar, bio } = updateUserDto;

    const updatedUser = this.userRepository.merge(user, { name, avatar, bio });

    return this.userRepository.save(updatedUser);
  }

  async deleteUser(userId: number): Promise<IUser> {
    const user = await this.findUserById(userId);
    await this.userRepository.delete(userId);

    return user;
  }
}
