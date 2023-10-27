import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { GeneralResponseDto } from 'src/dto/generalResponseDto';
import { EResult } from 'src/types';

@Injectable()
export class GeneralResponseInterceptor<T>
  implements NestInterceptor<T, GeneralResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<GeneralResponseDto<T>> {
    const { statusCode }: Response = context.switchToHttp().getResponse();

    return next
      .handle()
      .pipe(
        map(
          (data: T) =>
            new GeneralResponseDto<T>(statusCode, data, EResult.WORKING),
        ),
      );
  }
}
