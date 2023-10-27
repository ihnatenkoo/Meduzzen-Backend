import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { GeneralResponseDto } from 'src/dto/generalResponseDto';
import { EResult } from 'src/types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const statusCode = exception.getStatus();
    const { message } = exception;

    response
      .status(statusCode)
      .json(new GeneralResponseDto(statusCode, { message }, EResult.ERROR));
  }
}
