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
  time: string[];
}

export type FileType = 'json' | 'csv';
