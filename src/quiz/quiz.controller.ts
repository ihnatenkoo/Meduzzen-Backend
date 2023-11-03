import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { IdValidationPipe } from 'src/pipes/idValidationPipe';
import { CreateQuizDto } from './dto/createQuiz.dto';
import { QuizEntity } from './quiz.entity';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('create/:companyId')
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async createQuiz(
    @User('id') userId: number,
    @Param('companyId', IdValidationPipe) companyId: number,
    @Body() createQuizDto: CreateQuizDto,
  ): Promise<{ quiz: QuizEntity }> {
    return this.quizService.createQuiz(userId, companyId, createQuizDto);
  }
}
