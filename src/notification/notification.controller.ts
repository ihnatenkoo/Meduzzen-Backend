import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { IdValidationPipe } from 'src/pipes/idValidationPipe';
import { IMessage } from 'src/types';
import { NotificationEntity } from './notification.entity';
import { NotificationService } from './notification.service';

@ApiBearerAuth()
@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Get all user notifications' })
  @Get('list')
  @UseGuards(AuthGuard)
  async getAllNotifications(
    @User('id') userId: number,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.getAllNotifications(userId);
  }

  @ApiOperation({ summary: 'Mark notification as read' })
  @Get(':notificationId/mark-as-read')
  @UseGuards(AuthGuard)
  async markAsRead(
    @User('id') userId: number,
    @Param('notificationId', IdValidationPipe)
    notificationId: number,
  ): Promise<IMessage> {
    return this.notificationService.markAsRead(userId, notificationId);
  }
}
