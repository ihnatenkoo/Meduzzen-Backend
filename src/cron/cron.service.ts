import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsGateway } from 'src/events/events.gateway';
import { NotificationService } from 'src/notification/notification.service';
import { ENotificationType } from 'src/notification/types';
import { QuizResultEntity } from 'src/quiz-result/quiz-result.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(QuizResultEntity)
    private readonly quizResultRepository: Repository<QuizResultEntity>,
    private readonly notificationService: NotificationService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
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

        await this.notificationService.createNotification({
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
