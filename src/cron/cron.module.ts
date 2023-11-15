import { Module } from '@nestjs/common';
import { NotificationModule } from 'src/notification/notification.module';
import { EventsModule } from 'src/events/events.module';
import { QuizResultModule } from 'src/quiz-result/quiz-result.module';
import { CronService } from './cron.service';

@Module({
  imports: [QuizResultModule, NotificationModule, EventsModule],
  providers: [CronService],
})
export class CronModule {}
