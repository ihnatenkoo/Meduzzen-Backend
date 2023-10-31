import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';
import { ITokenPayload } from 'src/auth/types';
import { UserService } from 'src/user/user.service';
import { IExpressRequest } from 'src/types';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      }) as ITokenPayload;

      const { user } = await this.userService.findUserById(decode.id);

      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
