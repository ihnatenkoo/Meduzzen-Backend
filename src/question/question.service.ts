import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from './question.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { QuizEntity } from 'src/quiz/quiz.entity';
import { IMessage } from 'src/types';
import { isUserAdmin } from 'src/utils/isUserAdmin';
import { ACCESS_DENIED, QUESTION_NOT_FOUND } from 'src/constants';

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

  async updateQuestion(
    userId: number,
    questionId: number,
    updateQuestionDto: Partial<CreateQuestionDto>,
  ): Promise<{ question: QuestionEntity }> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['quiz.company.owner', 'quiz.company.admins'],
    });

    if (!question) {
      throw new HttpException(QUESTION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!isUserAdmin(userId, question.quiz.company)) {
      this.logger.error(
        `User id:${userId} tried to update question in quiz id:${question.quiz.id}`,
      );
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    this.questionRepository.merge(question, updateQuestionDto);

    const updatedQuestion = await this.questionRepository.save(question);

    this.logger.log(`Question id:${question.id} updated`);

    delete updatedQuestion.quiz;

    return { question: updatedQuestion };
  }

  async deleteQuestion(userId: number, questionId: number): Promise<IMessage> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['quiz.company.owner', 'quiz.company.admins'],
    });

    if (!question) {
      throw new HttpException(QUESTION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!isUserAdmin(userId, question.quiz.company)) {
      this.logger.error(
        `User id:${userId} tried to delete question in quiz id:${question.quiz.id}`,
      );
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    await this.questionRepository.delete(questionId);

    this.logger.log(`Question id:${questionId} deleted`);

    return { message: 'Question deleted successfully' };
  }
}
