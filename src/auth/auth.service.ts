import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { LoginAuth0Dto } from './dto/loginAuth0.dto';
import { UserEntity } from 'src/user/user.entity';
import { ICreateUserResponse, ITokenPayload, ITokens } from './types';
import { IMessage } from 'src/types';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import {
  ACCESS_DENIED,
  BAD_CREDENTIALS,
  PASSWORD_CHANGED_SUCCESSFULLY,
  UNAUTHORIZED,
  USER_ALREADY_SIGNUP,
  USER_CERATED_SUCCESSFULLY,
  USER_NOT_FOUND,
} from 'src/constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<ICreateUserResponse> {
    const existedUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existedUser) {
      this.logger.error(
        `${USER_ALREADY_SIGNUP}. Email: ${createUserDto.email}`,
      );

      throw new HttpException(
        USER_ALREADY_SIGNUP,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const hashPassword = await hash(createUserDto.password, 10);

    const user = await this.userRepository.save({
      ...createUserDto,
      password: hashPassword,
    });

    this.logger.log(`${USER_CERATED_SUCCESSFULLY}. Email: ${user.email}`);

    return {
      message: USER_CERATED_SUCCESSFULLY,
      userId: user.id,
    };
  }

  async login(loginDto: LoginDto): Promise<ITokens> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      this.logger.error(`${BAD_CREDENTIALS}. User id: ${user.id}`);

      throw new HttpException(BAD_CREDENTIALS, HttpStatus.FORBIDDEN);
    }

    const isPasswordCorrect = await this.validateUser(
      loginDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(BAD_CREDENTIALS, HttpStatus.FORBIDDEN);
    }

    this.logger.log(`User log in. Email: ${user.email}`);

    return this.generateTokens({ id: user.id, email: user.email });
  }

  async loginAuth0({ accessToken, user }: LoginAuth0Dto): Promise<ITokens> {
    const { email, name, avatar } = user;

    try {
      this.jwtService.verify(accessToken, {
        secret: process.env.AUTH0_SECRET_KEY,
      });

      const existedUser = await this.userRepository.findOne({
        where: { email },
      });

      if (!existedUser) {
        const { userId } = await this.createUser({
          email,
          name,
          avatar,
          password: randomBytes(8).toString('hex'),
        });

        return this.generateTokens({
          id: userId,
          email,
        });
      }

      return this.generateTokens({
        id: existedUser.id,
        email,
      });
    } catch (e) {
      throw new HttpException(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
  }

  async initResetPassword(email: string): Promise<IMessage> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const { activateToken } = this.generateTokens({ email, id: user.id });
    const link = `${process.env.CLIENT_URL}/reset-password/${activateToken}`;

    this.mailerService.sendMail({
      to: email,
      subject: `Reset Password Request: ${process.env.CLIENT_URL}`,
      html: `
					<div>
						<h1>To reset your password, please click on the following link:</h1>
						<a href=${link}>${link}</a>
					<div>
			`,
    });

    this.logger.warn(`Initialized reset password for user: ${user.email}`);

    return { message: 'Reset password initialized' };
  }

  async resetPassword({
    token,
    password,
  }: ResetPasswordDto): Promise<IMessage> {
    try {
      const { id } = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      }) as ITokenPayload;

      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const hashPassword = await hash(password, 10);
      const updatedUser = this.userRepository.merge(user, {
        password: hashPassword,
      });

      await this.userRepository.save(updatedUser);

      this.logger.warn(`${PASSWORD_CHANGED_SUCCESSFULLY}. User: ${user.email}`);

      return { message: PASSWORD_CHANGED_SUCCESSFULLY };
    } catch (error) {
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }
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
