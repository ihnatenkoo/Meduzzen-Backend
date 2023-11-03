import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { IHealthCheck } from './types';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHealthCheck(): Promise<IHealthCheck> {
    return this.appService.getHealthCheck();
  }
}
