import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    const id = Number(value);

    if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
      throw new HttpException(
        `Invalid ${metadata.data}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return id;
  }
}
