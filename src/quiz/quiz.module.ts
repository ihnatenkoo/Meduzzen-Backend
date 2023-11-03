import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from 'src/company/company.module';
import { QuizEntity } from './quiz.entity';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuizEntity]), CompanyModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
