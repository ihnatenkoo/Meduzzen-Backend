import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizEntity } from './quiz.entity';
import { CompanyEntity } from 'src/company/company.entity';
import { CreateQuizDto } from './dto/createQuiz.dto';
import { IMessage } from 'src/types';
import { isUserAdmin } from 'src/utils/isUserAdmin';
import {
  ACCESS_DENIED,
  COMPANY_NOT_FOUND,
  QUIZ_NOT_FOUND,
} from 'src/constants';

@Injectable()
export class QuizService {
  private readonly logger = new Logger(QuizService.name);

  constructor(
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async getQuiz(quizId: number): Promise<{
    quiz: QuizEntity;
  }> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['questions'],
    });

    if (!quiz) {
      throw new HttpException(QUIZ_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return { quiz };
  }

  async createQuiz(
    userId: number,
    companyId: number,
    createQuizDto: CreateQuizDto,
  ): Promise<{ quiz: QuizEntity }> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['owner', 'admins'],
    });

    if (!company) {
      throw new HttpException(COMPANY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!isUserAdmin(userId, company)) {
      this.logger.error(
        `User id:${userId} tried to create quiz in company id:${companyId}`,
      );
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    const quiz = await this.quizRepository.save({ ...createQuizDto, company });

    this.logger.log(`Quiz id:${quiz.id} created`);

    delete quiz.company;

    return { quiz };
  }

  async updateQuiz(
    userId: number,
    quizId: number,
    updateQuizDto: Partial<CreateQuizDto>,
  ): Promise<{ quiz: QuizEntity }> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['company.owner', 'company.admins'],
    });

    if (!quiz) {
      throw new HttpException(QUIZ_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!isUserAdmin(userId, quiz.company)) {
      this.logger.error(
        `User id:${userId} tried to update quiz in company id:${quiz.company.id}`,
      );
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    this.quizRepository.merge(quiz, updateQuizDto);

    const updatedQuiz = await this.quizRepository.save(quiz);

    this.logger.log(`Quiz id:${quiz.id} updated`);

    delete updatedQuiz.company;

    return { quiz: updatedQuiz };
  }

  async deleteQuiz(userId: number, quizId: number): Promise<IMessage> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['company.owner', 'company.admins'],
    });

    if (!quiz) {
      throw new HttpException(QUIZ_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!isUserAdmin(userId, quiz.company)) {
      this.logger.error(
        `User id:${userId} tried to delete quiz in company id:${quiz.company.id}`,
      );
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    await this.quizRepository.delete(quizId);

    this.logger.log(`Quiz id:${quizId} deleted`);

    return { message: 'Quiz deleted successfully' };
  }
}
