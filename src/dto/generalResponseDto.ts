import { HttpStatus } from '@nestjs/common';
import { EResult } from '../types';

export class GeneralResponseDto<T> {
  readonly status_code: HttpStatus;
  readonly detail: T;
  readonly result: EResult;

  constructor(statusCode: HttpStatus, detail: T, result: EResult) {
    this.status_code = statusCode;
    this.detail = detail;
    this.result = result;
  }
}
