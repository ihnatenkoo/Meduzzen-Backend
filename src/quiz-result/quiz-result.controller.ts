import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { CreateQuizResultDto } from './dto/createQuizResult.dto';
import { QuizResultService } from './quiz-result.service';

@ApiBearerAuth()
@ApiTags('quiz')
@Controller('quiz-result')
export class QuizResultController {
  constructor(private readonly quizResultService: QuizResultService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async createQuizResult(@Body() crateQuizResultDto: CreateQuizResultDto) {
    console.log('createQuizDto', crateQuizResultDto);
    return this.quizResultService.createQuizResult(crateQuizResultDto);
  }
}
