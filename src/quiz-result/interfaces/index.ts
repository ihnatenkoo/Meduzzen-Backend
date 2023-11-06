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
  isCorrect: boolean;
}