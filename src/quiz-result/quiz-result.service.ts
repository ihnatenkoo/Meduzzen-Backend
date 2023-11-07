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
  COMPANY_NOT_FOUND,
  QUIZ_NOT_FOUND,
  TWO_DAYS_IN_SECONDS,
} from 'src/constants';
import { CompanyEntity } from 'src/company/company.entity';

@Injectable()
export class QuizResultService {
  private readonly logger = new Logger(QuizResultService.name);

  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
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
      relations: [
        'questions',
        'completedQuizzes.user',
        'company.members',
        'company.owner',
        'company.admins',
      ],
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

    if (quiz.completedQuizzes.some((quiz) => quiz.user.id === user.id)) {
      throw new HttpException(
        'You already passed this quiz',
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

    const resultData = {
      user,
      quiz,
      company: quiz.company,
      correctAnswers,
      totalQuestions,
      ratio,
      details,
    };

    await this.quizResultRepository.save(resultData);

    delete resultData.quiz.questions;
    delete resultData.quiz.company;
    delete resultData.company.members;

    await this.cacheService.set(`quiz-${quizId}-user-${user.id}`, resultData, {
      ttl: TWO_DAYS_IN_SECONDS,
    });

    this.logger.log(`Created quiz result for user id:${user.id}`);

    return { result: { totalQuestions, correctAnswers, ratio } };
  }

  async getUserQuizResult(userId: number, quizId: number, candidateId: number) {
    const cacheKey = `quiz-${quizId}-user-${candidateId}`;

    const cachedQuizResult =
      await this.cacheService.get<QuizResultEntity>(cacheKey);

    if (cachedQuizResult) {
      if (
        userId !== candidateId &&
        !isUserAdmin(userId, cachedQuizResult.company)
      ) {
        throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
      }

      this.logger.log(`Get quiz result from cache for user id:${candidateId}`);

      delete cachedQuizResult.company?.owner;
      delete cachedQuizResult.company?.admins;

      return cachedQuizResult;
    }

    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: [
        'completedQuizzes.user',
        'completedQuizzes.company.owner',
        'completedQuizzes.company.admins',
        'company.owner',
        'company.admins',
      ],
    });

    const quizResult = quiz?.completedQuizzes?.find(
      (quiz) => quiz.user.id === candidateId,
    );

    if (!quizResult) {
      throw new HttpException('Quiz result not found', HttpStatus.NOT_FOUND);
    }

    if (userId !== candidateId && !isUserAdmin(userId, quiz.company)) {
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    await this.cacheService.set(cacheKey, quizResult, {
      ttl: TWO_DAYS_IN_SECONDS,
    });

    this.logger.log(`Get quiz result from DB for user id:${candidateId}`);

    delete quizResult.company?.owner;
    delete quizResult.company?.admins;

    return quizResult;
  }

  async getCompanyQuizzesResults(userId: number, companyId: number) {
    const cacheKey = `company-${companyId}-quizzes-results`;

    const cachedQuizResult =
      await this.cacheService.get<QuizResultEntity>(cacheKey);

    if (cachedQuizResult) {
      if (!isUserAdmin(userId, cachedQuizResult.company)) {
        throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
      }

      this.logger.log(`Get quiz result from cache for company id:${companyId}`);

      return cachedQuizResult;
    }

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['completedQuizzes', 'owner', 'admins'],
    });

    if (!company) {
      throw new HttpException(COMPANY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!isUserAdmin(userId, company)) {
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    await this.cacheService.set(
      cacheKey,
      { company },
      {
        ttl: TWO_DAYS_IN_SECONDS,
      },
    );

    this.logger.log(`Get quiz result from DB for company id:${companyId}`);

    return { company };
  }
}
