import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuizResultDto } from './dto/createQuizResult.dto';
import { QuizEntity } from 'src/quiz/quiz.entity';

@Injectable()
export class QuizResultService {
  constructor(
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,
  ) {}

  async createQuizResult(crateQuizResultDto: CreateQuizResultDto) {
    const quiz = await this.quizRepository.findOne({
      where: { id: crateQuizResultDto.quizId },
      relations: ['questions'],
    });

    console.log('quiz', quiz);
    return crateQuizResultDto;
  }
}
