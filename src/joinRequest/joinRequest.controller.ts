import { Controller, Param, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { IMessage } from 'src/types';
import { JoinRequestService } from './joinRequest.service';

@Controller('join-request')
export class JoinRequestController {
  constructor(private readonly joinRequestService: JoinRequestService) {}

  @Get('create/:id')
  @UseGuards(AuthGuard)
  async createJoinRequest(
    @User('id') userId: number,
    @Param('id') companyId: string,
  ): Promise<IMessage> {
    return this.joinRequestService.createJoinRequest(userId, +companyId);
  }

  @Get('cancel/:id')
  @UseGuards(AuthGuard)
  async cancelJoinRequest(
    @User('id') userId: number,
    @Param('id') companyId: string,
  ): Promise<IMessage> {
    return this.joinRequestService.cancelJoinRequest(userId, +companyId);
  }
}
