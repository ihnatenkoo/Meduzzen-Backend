import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { UserEntity } from 'src/user/user.entity';
import { ITokenPayload, ITokens } from './types';
import { LoginDto } from './dto/login.dto';

export const BAD_CREDENTIALS = 'Wrong email or password';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<ITokens> {
    const existedUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existedUser) {
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

    return this.generateTokens({ id: user.id, email: user.email });
  }

  async login(loginDto: LoginDto): Promise<ITokens> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['password'],
    });

    if (!user) {
      throw new HttpException(BAD_CREDENTIALS, HttpStatus.FORBIDDEN);
    }

    const isPasswordCorrect = await this.validateUser(
      loginDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(BAD_CREDENTIALS, HttpStatus.FORBIDDEN);
    }

    return this.generateTokens({ id: user.id, email: user.email });
  }

  async validateUser(password: string, passwordHash: string): Promise<boolean> {
    return compare(password, passwordHash);
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
