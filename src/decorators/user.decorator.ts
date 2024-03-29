import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IExpressRequest } from 'src/types';
import { UserEntity } from 'src/user/user.entity';

export const User = createParamDecorator(
  (data: keyof UserEntity, context: ExecutionContext) => {
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
