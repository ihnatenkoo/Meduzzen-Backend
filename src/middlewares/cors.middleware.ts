import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const reqOrigin = req.header('Origin');

    if (process.env.ALLOWED_ORIGINS.includes(reqOrigin)) {
      res.header('Access-Control-Allow-Origin', reqOrigin);
      res.header('Access-Control-Allow-Headers', 'content-type');
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE',
      );
      next();
    } else {
      throw new HttpException(
        'Access to this domain is not allowed.',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
