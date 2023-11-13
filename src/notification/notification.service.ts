import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';
import { QuizResultEntity } from 'src/quiz-result/quiz-result.entity';
import { EventsGateway } from 'src/events/events.gateway';
import { ENotificationStatus, ENotificationType, INotification } from './types';
import { IMessage } from 'src/types';
import { ACCESS_DENIED } from 'src/constants';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(QuizResultEntity)
    private readonly quizResultRepository: Repository<QuizResultEntity>,
    private readonly eventsGateway: EventsGateway,
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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async sendNotificationsOnRepeatingQuizzes(): Promise<void> {
    const availableQuizzes = await this.quizResultRepository
      .createQueryBuilder('quizResult')
      .leftJoinAndSelect('quizResult.quiz', 'quiz')
      .leftJoinAndSelect('quizResult.user', 'user')
      .leftJoinAndSelect('quizResult.company', 'company')
      .where(
        `quizResult.finalTime  + (quiz.frequency || ' day')::interval < :currentDate`,
        {
          currentDate: new Date(),
        },
      )
      .andWhere((queryBuilder) => {
        const subQuery = queryBuilder
          .subQuery()
          .select('MAX(quizzes_results.finalTime)', 'maxFinalTime')
          .from(QuizResultEntity, 'quizzes_results')
          .where(
            'quizzes_results.quiz.id = quiz.id AND quizzes_results.user.id = user.id',
          )
          .groupBy('quizzes_results.quiz.id, quizzes_results.user.id')
          .getQuery();

        return `quizResult.finalTime = (${subQuery})`;
      })
      .getMany();

    await Promise.allSettled(
      availableQuizzes.map(async (result) => {
        const text = `The quiz ${result.quiz?.name} is available again in the company ${result.company?.name}`;

        await this.createNotification({
          text,
          user: result.user,
          company: result.company,
          type: ENotificationType.COMPANY,
        });

        await this.eventsGateway.sendMessageToRoom({
          room: result.user?.id.toString(),
          text,
        });
      }),
    );
  }
}
