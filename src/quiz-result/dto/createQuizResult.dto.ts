import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';

interface IQuestionResult {
  questionId: number;
  userAnswerIndex: number;
}

export class CreateQuizResultDto {
  @IsNumber()
  readonly quizId: number;

  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  readonly result: IQuestionResult[];
}
