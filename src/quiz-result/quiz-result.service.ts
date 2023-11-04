import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuizResultDto } from './dto/createQuizResult.dto';
import { QuizEntity } from 'src/quiz/quiz.entity';
import { QuizResultEntity } from './quiz-result.entity';
import { UserEntity } from 'src/user/user.entity';
import { ICreateQuizResult } from './interface';
import { QUIZ_NOT_FOUND } from 'src/constants';

@Injectable()
export class QuizResultService {
  constructor(
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,
    @InjectRepository(QuizResultEntity)
    private readonly quizResultRepository: Repository<QuizResultEntity>,
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

    quiz.questions.forEach((question) => {
      if (question.correctAnswerIndex === userAnswersNormalize[question.id]) {
        correctAnswers++;
      }
    });

    const ratio = +(correctAnswers / totalQuestions).toFixed(2);

    await this.quizResultRepository.save({
      user,
      correctAnswers,
      ratio,
      totalQuestions,
      quiz,
      company: quiz.company,
    });

    return { result: { totalQuestions, correctAnswers, ratio } };
  }
}
