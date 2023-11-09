import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizModule } from 'src/quiz/quiz.module';
import { QuizResultEntity } from './quiz-result.entity';
import { QuizResultController } from './quiz-result.controller';
import { QuizResultService } from './quiz-result.service';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizResultEntity]),
    CompanyModule,
    QuizModule,
  ],
  controllers: [QuizResultController],
  providers: [QuizResultService],
})
export class QuizResultModule {}
