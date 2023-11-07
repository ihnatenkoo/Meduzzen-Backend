import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UsePipes,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, promises } from 'fs';
import { join } from 'path';
import * as json2csv from 'json2csv';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { IdValidationPipe } from 'src/pipes/idValidationPipe';
import { CreateQuizResultDto } from './dto/createQuizResult.dto';
import { UserEntity } from 'src/user/user.entity';
import { FileType, ICreateQuizResult } from './interfaces';
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

  @ApiOperation({
    summary: 'Download quiz result by user in formats: json,csv',
  })
  @Get('download')
  @UseGuards(AuthGuard)
  async downloadQuizResult(
    @User('id') userId: number,
    @Query('quizId', IdValidationPipe) quizId: number,
    @Query('candidateId', IdValidationPipe) candidateId: number,
    @Query('type') type: FileType,
    @Res() response: Response,
  ) {
    const data = await this.quizResultService.getQuizResult(
      userId,
      quizId,
      candidateId,
    );

    try {
      const fileName = `result-user-${candidateId}-quiz-${quizId}`;
      const directoryPath = join(process.cwd(), 'files');
      const filePath = join(directoryPath, fileName);

      const file =
        type === 'json' ? JSON.stringify(data) : json2csv.parse(data);

      await promises.mkdir(directoryPath, { recursive: true });
      await promises.writeFile(filePath, file);

      const fileStream = createReadStream(filePath);

      response.set({
        'Content-Type': `${type === 'json' ? 'application/json' : 'text/csv'}`,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      });

      fileStream.pipe(response);

      fileStream.on('close', async () => {
        await promises.unlink(filePath);
      });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }
}
