import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(value: any) {
    const id = Number(value);

    if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    return id;
  }
}
