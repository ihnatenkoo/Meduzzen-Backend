import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { IdValidationPipe } from 'src/pipes/idValidationPipe';
import { CreateQuizResultDto } from './dto/createQuizResult.dto';
import { UserEntity } from 'src/user/user.entity';
import { ICreateQuizResult } from './interfaces';
import { QuizResultService } from './quiz-result.service';

@ApiBearerAuth()
@ApiTags('quiz')
@Controller('quiz-result')
export class QuizResultController {
  constructor(private readonly quizResultService: QuizResultService) {}

  @ApiOperation({ summary: 'Create quiz result' })
  @Post('create')
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async createQuizResult(
    @User() user: UserEntity,
    @Body() crateQuizResultDto: CreateQuizResultDto,
  ): Promise<ICreateQuizResult> {
    return this.quizResultService.createQuizResult(user, crateQuizResultDto);
  }

  @ApiOperation({ summary: 'Get quiz result by ID' })
  @Get(':id')
  @UseGuards(AuthGuard)
  async getQuizResult(
    @User('id') userId: number,
    @Param('id', IdValidationPipe) resultId: number,
  ) {
    return this.quizResultService.getQuizResult(userId, resultId);
  }
}
