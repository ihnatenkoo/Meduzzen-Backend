import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from 'src/user/user.entity';

export interface IExpressRequest extends Request {
  user?: UserEntity;
}

export interface IHealthCheck {
  status_code: HttpStatus;
  detail: string;
  result: string;
}

export const enum EResult {
  WORKING = 'working',
  ERROR = 'error',
}
