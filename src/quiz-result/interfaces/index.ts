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

export interface ICompanyQuizzesResults {
  companyName: string;
  membersResults: UserEntity[];
}

export type FileType = 'json' | 'csv';
