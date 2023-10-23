import { HttpStatus } from '@nestjs/common';

export interface IHealthCheck {
  status_code: HttpStatus;
  detail: string;
  result: string;
}
