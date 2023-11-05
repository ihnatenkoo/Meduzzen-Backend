import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuizResultDto } from './dto/createQuizResult.dto';
import { QuizEntity } from 'src/quiz/quiz.entity';
import { QuizResultEntity } from './quiz-result.entity';
import { UserEntity } from 'src/user/user.entity';
import { ICreateQuizResult, IQuizResultDetail } from './interfaces';
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

    const details: IQuizResultDetail[] = quiz.questions.map((question) => {
      const userAnswerIndex = userAnswersNormalize[question.id];
      const userAnswerValue = question.answers[userAnswerIndex];
      let isCorrect = false;

      if (question.correctAnswerIndex === userAnswerIndex) {
        correctAnswers++;
        isCorrect = true;
      }

      return {
        question: question.question,
        answer: userAnswerValue,
        isCorrect,
      };
    });

    const ratio = +(correctAnswers / totalQuestions).toFixed(2);

    await this.quizResultRepository.save({
      user,
      quiz,
      company: quiz.company,
      correctAnswers,
      totalQuestions,
      ratio,
      details,
    });

    return { result: { totalQuestions, correctAnswers, ratio } };
  }
}
