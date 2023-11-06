import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { IHealthCheck } from './types';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Health check',
  })
  @Get()
  async getHealthCheck(): Promise<IHealthCheck> {
    return this.appService.getHealthCheck();
  }
}
