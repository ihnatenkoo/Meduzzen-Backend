import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UsePipes,
  Query,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, promises } from 'fs';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { IdValidationPipe } from 'src/pipes/idValidationPipe';
import { CreateQuizResultDto } from './dto/createQuizResult.dto';
import { UserEntity } from 'src/user/user.entity';
import { QuizResultEntity } from './quiz-result.entity';
import { createFile } from 'src/utils/createFile';
import { QuizResultService } from './quiz-result.service';
import {
  FileType,
  ICompanyQuizzesResultsWithTime,
  ICreateQuizResult,
  IQuizzesResultsWithHistory,
} from './interfaces';

@ApiBearerAuth()
@ApiTags('quiz-result')
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

  @ApiOperation({
    summary: 'Get user completed quizzes with final time',
  })
  @Get('final-time/user/:userId')
  @UseGuards(AuthGuard)
  async getUserQuizzesFinalTime(
    @Param('userId', IdValidationPipe) userId: number,
  ): Promise<{
    quizResults: QuizResultEntity[];
  }> {
    return this.quizResultService.getUserQuizzesFinalTime(userId);
  }

  @ApiOperation({
    summary: 'Get user completed quizzes with final time inside company ',
  })
  @Get('final-time/company/:companyId')
  @UseGuards(AuthGuard)
  async getUserInCompanyQuizzesFinalTime(
    @User('id') userId: number,
    @Param('companyId', IdValidationPipe) companyId: number,
  ): Promise<ICompanyQuizzesResultsWithTime> {
    return this.quizResultService.getMembersQuizzesFinalTime(userId, companyId);
  }

  @ApiOperation({
    summary: 'Get user quiz ratio with history',
  })
  @Get('history/quiz/:quizId')
  @UseGuards(AuthGuard)
  async getUserQuizRatioHistory(
    @User('id') userId: number,
    @Param('quizId', IdValidationPipe) quizId: number,
  ): Promise<IQuizzesResultsWithHistory> {
    return this.quizResultService.getUserQuizRatioHistory(userId, quizId);
  }

  @ApiOperation({
    summary: 'Get company all members quizzes ratio with history',
  })
  @Get('history/company/:companyId')
  async getMembersCompanyRatioHistory(
    @User('id') userId: number,
    @Param('companyId', IdValidationPipe) companyId: number,
  ): Promise<IQuizzesResultsWithHistory> {
    return this.quizResultService.getCompanyRatioHistory(userId, companyId);
  }

  @ApiOperation({
    summary: 'Get company certain member quizzes ratio with history',
  })
  @Get('history/company/:companyId/user/:candidateId')
  @UseGuards(AuthGuard)
  async getUserCompanyRatioHistory(
    @User('id') userId: number,
    @Param('companyId', IdValidationPipe) companyId: number,
    @Param('candidateId', IdValidationPipe) candidateId: number,
  ): Promise<IQuizzesResultsWithHistory> {
    return this.quizResultService.getCompanyRatioHistory(
      userId,
      companyId,
      candidateId,
    );
  }

  @ApiOperation({
    summary: 'Download quiz result by user in formats: json,csv',
  })
  @Get('download')
  @UseGuards(AuthGuard)
  async downloadUserQuizResult(
    @User('id') userId: number,
    @Query('quizId', IdValidationPipe) quizId: number,
    @Query('candidateId', IdValidationPipe) candidateId: number,
    @Query('type') type: FileType,
    @Res() response: Response,
  ): Promise<void> {
    const data = await this.quizResultService.downloadUserQuizResult(
      userId,
      quizId,
      candidateId,
    );

    const { filePath, fileName } = await createFile(data, type);

    response.set({
      'Content-Type': `${type === 'json' ? 'application/json' : 'text/csv'}`,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    const fileStream = createReadStream(filePath);
    fileStream.pipe(response);
    fileStream.on('close', async () => {
      await promises.unlink(filePath);
    });
  }

  @ApiOperation({
    summary: 'Download quiz result by company in formats: json,csv',
  })
  @Get('download/company/:companyId')
  @UseGuards(AuthGuard)
  async downloadCompanyQuizzesResults(
    @User('id') userId: number,
    @Param('companyId', IdValidationPipe) companyId: number,
    @Query('type')
    type: FileType,
    @Res() response: Response,
  ): Promise<void> {
    const data = await this.quizResultService.downloadCompanyQuizzesResults(
      userId,
      companyId,
    );

    const { filePath, fileName } = await createFile(data, type);

    response.set({
      'Content-Type': `${type === 'json' ? 'application/json' : 'text/csv'}`,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    const fileStream = createReadStream(filePath);
    fileStream.pipe(response);
    fileStream.on('close', async () => {
      await promises.unlink(filePath);
    });
  }

  @ApiOperation({
    summary: 'Download quiz results by quizId in formats: json,csv',
  })
  @Get('download/quiz/:quizId')
  @UseGuards(AuthGuard)
  async downloadQuizResult(
    @User('id') userId: number,
    @Param('quizId', IdValidationPipe) quizId: number,
    @Query('type')
    type: FileType,
    @Res() response: Response,
  ): Promise<void> {
    const data = await this.quizResultService.downloadQuizResult(
      userId,
      quizId,
    );

    const { filePath, fileName } = await createFile(data, type);

    response.set({
      'Content-Type': `${type === 'json' ? 'application/json' : 'text/csv'}`,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    const fileStream = createReadStream(filePath);
    fileStream.pipe(response);
    fileStream.on('close', async () => {
      await promises.unlink(filePath);
    });
  }
}
