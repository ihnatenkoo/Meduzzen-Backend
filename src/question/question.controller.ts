import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { IdValidationPipe } from 'src/pipes/idValidationPipe';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { IMessage } from 'src/types';
import { QuestionEntity } from './question.entity';
import { QuestionService } from './question.service';

@ApiTags('question')
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

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async updateQuestion(
    @User('id') userId: number,
    @Param('id', IdValidationPipe) questionId: number,
    @Body() updateQuestionDto: Partial<CreateQuestionDto>,
  ): Promise<{ question: QuestionEntity }> {
    return this.questionService.updateQuestion(
      userId,
      questionId,
      updateQuestionDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteQuestion(
    @User('id') userId: number,
    @Param('id', IdValidationPipe) questionId: number,
  ): Promise<IMessage> {
    return this.questionService.deleteQuestion(userId, questionId);
  }
}
