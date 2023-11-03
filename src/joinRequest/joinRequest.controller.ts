import {
  Controller,
  Param,
  Get,
  UseGuards,
  Post,
  UsePipes,
  Body,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { IdValidationPipe } from 'src/pipes/idValidationPipe';
import { IMessage } from 'src/types';
import { RespondInvitationDto } from 'src/invitation/dto/respondInvitation.dto';
import { JoinRequestEntity } from './joinRequest.entity';
import { JoinRequestService } from './joinRequest.service';

@ApiBearerAuth()
@ApiTags('join-request')
@Controller('join-request')
export class JoinRequestController {
  constructor(private readonly joinRequestService: JoinRequestService) {}

  @ApiOperation({ summary: 'Get all user join-requests' })
  @Get('list')
  @UseGuards(AuthGuard)
  async getJoinRequestsList(@User('id') userId: number): Promise<{
    joinRequests: JoinRequestEntity[];
  }> {
    return this.joinRequestService.getJoinRequestsList(userId);
  }

  @ApiOperation({ summary: 'Create join-request to company' })
  @Post('create/:companyId')
  @UseGuards(AuthGuard)
  async createJoinRequest(
    @User('id') userId: number,
    @Param('companyId', IdValidationPipe) companyId: number,
  ): Promise<IMessage> {
    return this.joinRequestService.createJoinRequest(userId, companyId);
  }

  @ApiOperation({ summary: 'Respond to join-request' })
  @Post('respond/:id')
  @HttpCode(200)
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

  @ApiOperation({ summary: 'Cancel join-request to company' })
  @Delete('cancel/:id')
  @UseGuards(AuthGuard)
  async cancelJoinRequest(
    @User('id') userId: number,
    @Param('id', IdValidationPipe) companyId: number,
  ): Promise<IMessage> {
    return this.joinRequestService.cancelJoinRequest(userId, companyId);
  }
}
