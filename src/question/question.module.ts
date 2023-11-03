import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizModule } from 'src/quiz/quiz.module';
import { QuestionEntity } from './question.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionEntity]), QuizModule],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
