import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './notification.entity';
import { ENotificationStatus, INotification } from './types';
import { IMessage } from 'src/types';
import { ACCESS_DENIED } from 'src/constants';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async createNotification(data: INotification): Promise<void> {
    try {
      await this.notificationRepository.save(data);
    } catch (error) {
      throw new HttpException(
        `Save notification error: ${error?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllNotifications(userId: number): Promise<NotificationEntity[]> {
    return this.notificationRepository.find({
      where: { status: ENotificationStatus.UNREAD, user: { id: userId } },
    });
  }

  async markAsRead(userId: number, notificationId: number): Promise<IMessage> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
      relations: ['user'],
    });

    if (notification.user.id !== userId) {
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    this.notificationRepository.merge(notification, {
      status: ENotificationStatus.READ,
    });

    await this.notificationRepository.save(notification);

    return { message: `Notification id:${notification.id} marked as read` };
  }
}
