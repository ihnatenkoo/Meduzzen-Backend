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
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { QuestionEntity } from './question.entity';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('create/:quizId')
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async createQuestion(
    @User('id') userId: number,
    @Param('quizId', IdValidationPipe) quizId: number,
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<{ question: QuestionEntity }> {
    return this.questionService.createQuestion(
      userId,
      quizId,
      createQuestionDto,
    );
  }
}