import { Module } from '@nestjs/common';
import { JoinRequestController } from './joinRequest.controller';
import { JoinRequestService } from './joinRequest.service';

@Module({
  controllers: [JoinRequestController],
  providers: [JoinRequestService],
})
export class JoinRequestModule {}
