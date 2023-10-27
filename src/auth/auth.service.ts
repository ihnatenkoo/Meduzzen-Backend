import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserEntity } from 'src/user/user.entity';
import { ITokenPayload, ITokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<ITokens> {
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

    const tokens = this.generateTokens({ id: user.id, email: user.email });

    return tokens;
  }

  generateTokens(payload: ITokenPayload): ITokens {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: '24h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: '14d',
    });

    const activateToken = this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: '24h',
    });

    return { accessToken, refreshToken, activateToken };
  }
}
