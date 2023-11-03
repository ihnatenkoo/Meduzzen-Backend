import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { IdValidationPipe } from 'src/pipes/idValidationPipe';
import { IMessage } from 'src/types';
import { CreateInvitationDto } from './dto/createInvitation.dto';
import { RespondInvitationDto } from './dto/respondInvitation.dto';
import { InvitationEntity } from './invitation.entity';
import { InvitationService } from './invitation.service';

@ApiBearerAuth()
@ApiTags('invitation')
@Controller('invitation')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @ApiOperation({ summary: 'Get all user invitations' })
  @Get('list')
  @UseGuards(AuthGuard)
  async getInvitations(
    @User('id') userId: number,
  ): Promise<{ invitations: InvitationEntity[] }> {
    return this.invitationService.getInvitations(userId);
  }

  @ApiOperation({ summary: 'Create invitation to company' })
  @Post('create')
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async createInvitation(
    @User('id') userId: number,
    @Body() createInvitationDto: CreateInvitationDto,
  ): Promise<IMessage> {
    return this.invitationService.createInvitation(userId, createInvitationDto);
  }

  @ApiOperation({ summary: 'Respond invitation by ID' })
  @Post('/respond/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async respondToInvitation(
    @User('id') userId: number,
    @Param('id', IdValidationPipe) invitationId: number,
    @Body() respondDto: RespondInvitationDto,
  ): Promise<IMessage> {
    return this.invitationService.respondToInvitation(
      userId,
      invitationId,
      respondDto,
    );
  }

  @ApiOperation({ summary: 'Cancel invitation by ID' })
  @Delete(':id')
  @UseGuards(AuthGuard)
  async cancelInvitation(
    @User('id') userId: number,
    @Param('id', IdValidationPipe) invitationId: number,
  ): Promise<IMessage> {
    return this.invitationService.cancelInvitation(userId, invitationId);
  }
}
