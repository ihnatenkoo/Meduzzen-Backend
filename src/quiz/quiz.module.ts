import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from 'src/company/company.module';
import { NotificationModule } from 'src/notification/notification.module';
import { EventsModule } from 'src/events/events.module';
import { QuizEntity } from './quiz.entity';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizEntity]),
    CompanyModule,
		EventsModule,
    forwardRef(() => NotificationModule),
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [TypeOrmModule],
})
export class QuizModule {}
