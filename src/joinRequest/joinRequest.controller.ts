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
import { IMessage } from 'src/types';
import { RespondJoinRequestDto } from './dto/respondJoinRequest.dto';
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

  @Post('respond/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async respondJoinRequest(
    @User('id') userId: number,
    @Param('id') companyId: string,
    @Body() respondDto: RespondJoinRequestDto,
  ): Promise<IMessage> {
    return this.joinRequestService.respondJoinRequest(
      userId,
      +companyId,
      respondDto,
    );
  }
}
