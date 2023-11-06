import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
  UsePipes,
  Query,
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

  @ApiOperation({ summary: 'Download quiz result by ID in formats: json, csv' })
  @Get('download/:id')
  @UseGuards(AuthGuard)
  async downloadQuizResult(
    @User('id') userId: number,
    @Param('id', IdValidationPipe) resultId: number,
    @Query('type') type: FileType,
    @Res() response: Response,
  ) {
    const data = await this.quizResultService.getQuizResult(userId, resultId);

    const fileName = `quiz-result-${resultId}.json`;
    const directoryPath = join(process.cwd(), 'files');
    const filePath = join(directoryPath, fileName);

    const file = type === 'json' ? JSON.stringify(data) : json2csv.parse(data);

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
  }
}
