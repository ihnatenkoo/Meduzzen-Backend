import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [EventsGateway, JwtService],
  exports: [EventsGateway],
})
export class EventsModule {}
