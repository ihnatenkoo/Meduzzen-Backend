import { Module } from '@nestjs/common';
import { QuizResultController } from './quiz-result.controller';
import { QuizResultService } from './quiz-result.service';
import { QuizModule } from 'src/quiz/quiz.module';

@Module({
  imports: [QuizModule],
  controllers: [QuizResultController],
  providers: [QuizResultService],
})
export class QuizResultModule {}
