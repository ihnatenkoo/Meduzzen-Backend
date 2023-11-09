import { QuizEntity } from 'src/quiz/quiz.entity';
import { UserEntity } from 'src/user/user.entity';

export interface ICreateQuizResult {
  result: {
    totalQuestions: number;
    correctAnswers: number;
    ratio: number;
  };
}

export interface IQuizResultDetail {
  question: string;
  answer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface IQuizzesResultsWithHistory {
  labels: string[];
  ratio: number[];
}

export interface ICompletedQuizzesWithTime {
  finalTime: Date;
  quiz: QuizEntity;
  user: UserEntity;
}

export interface ICompanyQuizzesResultsWithTime {
  companyName: string;
  completedQuizzesWithTime: ICompletedQuizzesWithTime[];
}
export interface IHistoryResultsRaw {
  date: Date;
  average_ratio: string;
}

export type FileType = 'json' | 'csv';
