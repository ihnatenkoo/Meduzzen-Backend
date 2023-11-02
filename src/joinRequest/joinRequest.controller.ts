import {
  Controller,
  Param,
  Get,
  UseGuards,
  Post,
  UsePipes,
  Body,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { IdValidationPipe } from 'src/pipes/idValidationPipe';
import { IMessage } from 'src/types';
import { RespondInvitationDto } from 'src/invitation/dto/respondInvitation.dto';
import { JoinRequestEntity } from './joinRequest.entity';
import { JoinRequestService } from './joinRequest.service';

@Controller('join-request')
export class JoinRequestController {
  constructor(private readonly joinRequestService: JoinRequestService) {}

  @Get('list')
  @UseGuards(AuthGuard)
  async getJoinRequestsList(@User('id') userId: number): Promise<{
    joinRequests: JoinRequestEntity[];
  }> {
    return this.joinRequestService.getJoinRequestsList(userId);
  }

  @Get('create/:id')
  @UseGuards(AuthGuard)
  async createJoinRequest(
    @User('id') userId: number,
    @Param('id', IdValidationPipe) companyId: number,
  ): Promise<IMessage> {
    return this.joinRequestService.createJoinRequest(userId, companyId);
  }

  @Get('cancel/:id')
  @UseGuards(AuthGuard)
  async cancelJoinRequest(
    @User('id') userId: number,
    @Param('id', IdValidationPipe) companyId: number,
  ): Promise<IMessage> {
    return this.joinRequestService.cancelJoinRequest(userId, companyId);
  }

  @Post('respond/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async respondJoinRequest(
    @User('id') userId: number,
    @Param('id', IdValidationPipe) joinRequestId: number,
    @Body() respondDto: RespondInvitationDto,
  ): Promise<IMessage> {
    return this.joinRequestService.respondJoinRequest(
      userId,
      joinRequestId,
      respondDto,
    );
  }
}
