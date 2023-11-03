import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from './question.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { QuizEntity } from 'src/quiz/quiz.entity';
import { isUserAdmin } from 'src/utils/isUserAdmin';
import { ACCESS_DENIED } from 'src/constants';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);

  constructor(
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}

  async createQuestion(
    userId: number,
    quizId: number,
    createQuestionDto: CreateQuestionDto,
  ): Promise<{ question: QuestionEntity }> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['company.owner', 'company.admins'],
    });

    if (!quiz) {
      throw new HttpException('Quiz not found', HttpStatus.NOT_FOUND);
    }

    if (!isUserAdmin(userId, quiz.company)) {
      this.logger.error(
        `User id:${userId} tried to create question in quiz id:${quiz.id}`,
      );
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    const question = await this.questionRepository.save({
      ...createQuestionDto,
      quiz,
    });

    this.logger.log(`Question id:${question.id} created`);

    delete question.quiz;

    return { question };
  }
}
