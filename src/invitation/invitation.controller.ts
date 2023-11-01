import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { IMessage } from 'src/types';
import { CreateInvitationDto } from './dto/createInvitation.dto';
import { InvitationEntity } from './invitation.entity';
import { InvitationService } from './invitation.service';

@Controller('invitation')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async createInvitation(
    @User('id') userId: number,
    @Body() createInvitationDto: CreateInvitationDto,
  ): Promise<IMessage> {
    return this.invitationService.createInvitation(userId, createInvitationDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async cancelInvitation(
    @User('id') userId: number,
    @Param('id') invitationId: string,
  ): Promise<IMessage> {
    return this.invitationService.cancelInvitation(userId, +invitationId);
  }

  //TODO: for test
  @Get()
  async findAll(): Promise<InvitationEntity[]> {
    return this.invitationService.findAll();
  }
}
