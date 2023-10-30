import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IExpressRequest } from 'src/types';

export const User = createParamDecorator(
  (data: any, context: ExecutionContext) => {
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
