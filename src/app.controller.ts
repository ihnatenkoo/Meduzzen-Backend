import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IHealthCheck } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHealthCheck(): Promise<IHealthCheck> {
    return this.appService.getHealthCheck();
  }
}
