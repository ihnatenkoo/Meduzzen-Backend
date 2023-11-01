import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IExpressRequest } from 'src/types';
import { IUser } from 'src/user/types/user.interface';

export const User = createParamDecorator(
  (data: keyof IUser, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<IExpressRequest>();

    if (!request.user) {
      return null;
    }

    if (data) {
      return request.user[data];
    }

    return request.user;
  },
);
