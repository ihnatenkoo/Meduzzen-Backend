import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { CreateQuizResultDto } from './dto/createQuizResult.dto';
import { QuizEntity } from 'src/quiz/quiz.entity';
import { QuizResultEntity } from './quiz-result.entity';
import { UserEntity } from 'src/user/user.entity';
import { ICreateQuizResult, IQuizResultDetail } from './interfaces';
import { isUserAdmin } from 'src/utils/isUserAdmin';
import {
  ACCESS_DENIED,
  QUIZ_NOT_FOUND,
  TWO_DAYS_IN_SECONDS,
} from 'src/constants';

@Injectable()
export class QuizResultService {
  private readonly logger = new Logger(QuizResultService.name);

  constructor(
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,
    @InjectRepository(QuizResultEntity)
    private readonly quizResultRepository: Repository<QuizResultEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async createQuizResult(
    user: UserEntity,
    { quizId, result }: CreateQuizResultDto,
  ): Promise<ICreateQuizResult> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['questions', 'company.members'],
    });

    if (!quiz) {
      throw new HttpException(QUIZ_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!quiz.company.members.some((member) => member.id === user.id)) {
      throw new HttpException(
        `You are not a member in company id:${quiz.company.id}`,
        HttpStatus.FORBIDDEN,
      );
    }

    const totalQuestions = quiz.questions.length;

    if (totalQuestions !== result.length) {
      throw new HttpException(
        'Different length between array of questions and answers',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userAnswersNormalize = result.reduce((acc, value) => {
      acc[value.questionId] = value.userAnswerIndex;
      return acc;
    }, {});

    let correctAnswers = 0;

    const details: IQuizResultDetail[] = quiz.questions.map((question) => {
      const userAnswerIndex = userAnswersNormalize[question.id];
      const userAnswerValue = question.answers[userAnswerIndex];
      const correctAnswer = question.answers[question.correctAnswerIndex];
      let isCorrect = false;

      if (question.correctAnswerIndex === userAnswerIndex) {
        correctAnswers++;
        isCorrect = true;
      }

      return {
        question: question.question,
        answer: userAnswerValue,
        correctAnswer,
        isCorrect,
      };
    });

    const ratio = +(correctAnswers / totalQuestions).toFixed(2);

    const newQuizResult = await this.quizResultRepository.save({
      user,
      quiz,
      company: quiz.company,
      correctAnswers,
      totalQuestions,
      ratio,
      details,
    });

    const quizResult = await this.quizResultRepository.findOne({
      where: { id: newQuizResult.id },
      relations: ['user', 'quiz', 'company.owner', 'company.admins'],
    });

    await this.cacheService.set(`quizResult${quizResult.id}`, quizResult, {
      ttl: TWO_DAYS_IN_SECONDS,
    });

    this.logger.log(`Created quiz result for user id:${user.id}`);

    return { result: { totalQuestions, correctAnswers, ratio } };
  }

  async getQuizResult(userId: number, resultId: number) {
    const cachedQuizResult = await this.cacheService.get<QuizResultEntity>(
      `quizResult${resultId}`,
    );

    if (cachedQuizResult) {
      if (
        cachedQuizResult.user.id !== userId &&
        !isUserAdmin(userId, cachedQuizResult.company)
      ) {
        throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
      }

      this.logger.log(`Get quiz result from cache for user id:${userId}`);

      delete cachedQuizResult.company.owner;
      delete cachedQuizResult.company.admins;

      return cachedQuizResult;
    }

    const quizResult = await this.quizResultRepository.findOne({
      where: { id: resultId },
      relations: ['user', 'quiz', 'company.owner', 'company.admins'],
    });

    if (!quizResult) {
      throw new HttpException('Quiz result not found', HttpStatus.NOT_FOUND);
    }

    if (
      quizResult.user.id !== userId &&
      !isUserAdmin(userId, quizResult.company)
    ) {
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    await this.cacheService.set(`quizResult${resultId}`, quizResult, {
      ttl: TWO_DAYS_IN_SECONDS,
    });

    this.logger.log(`Get quiz result from DB for user id:${userId}`);

    delete quizResult.company.owner;
    delete quizResult.company.admins;

    return quizResult;
  }
}
