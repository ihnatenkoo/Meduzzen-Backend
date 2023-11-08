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

export interface IQuizzesResultsRawData {
  date: string;
  user_id: number;
  correct_answers: string;
  total_questions: string;
}

export interface IQuizzesResultsAggregatedData {
  date: string;
  totalCorrectAnswers: number;
  totalQuestions: number;
}

export type FileType = 'json' | 'csv';
