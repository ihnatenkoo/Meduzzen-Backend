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
    const exceptionResponse = exception.getResponse();

    response
      .status(statusCode)
      .json(
        new GeneralResponseDto(statusCode, exceptionResponse, EResult.ERROR),
      );
  }
}
