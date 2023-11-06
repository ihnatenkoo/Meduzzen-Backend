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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { IdValidationPipe } from 'src/pipes/idValidationPipe';
import { CreateQuizDto, UpdateQuizDto } from './dto/createQuiz.dto';
import { IMessage } from 'src/types';
import { QuizEntity } from './quiz.entity';
import { QuizService } from './quiz.service';

@ApiBearerAuth()
@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @ApiOperation({ summary: 'Create quiz in company' })
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

  @ApiOperation({ summary: 'Update quiz by ID' })
  @ApiBody({
    type: UpdateQuizDto,
  })
  @Patch(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async updateQuiz(
    @User('id') userId: number,
    @Param('id', IdValidationPipe) quizId: number,
    @Body() updateQuizDto: UpdateQuizDto,
  ): Promise<{ quiz: QuizEntity }> {
    return this.quizService.updateQuiz(userId, quizId, updateQuizDto);
  }

  @ApiOperation({ summary: 'Delete quiz by ID' })
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteQuiz(
    @User('id') userId: number,
    @Param('id', IdValidationPipe) quizId: number,
  ): Promise<IMessage> {
    return this.quizService.deleteQuiz(userId, quizId);
  }
}
