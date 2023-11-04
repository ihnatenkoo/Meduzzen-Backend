export interface ICreateQuizResult {
  result: {
    totalQuestions: number;
    correctAnswers: number;
    ratio: number;
  };
}
