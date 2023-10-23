import { HttpStatus, Injectable } from '@nestjs/common';
import { IHealthCheck } from './types';

@Injectable()
export class AppService {
  async getHealthCheck(): Promise<IHealthCheck> {
    return { status_code: HttpStatus.OK, detail: 'ok', result: 'working' };
  }
}
