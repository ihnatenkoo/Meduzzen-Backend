import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  readonly question: string;

  @IsArray()
  @ArrayMinSize(2, { message: 'Question must have at least 2 answers' })
  @ArrayMaxSize(5, { message: 'Question can have at most 5 answers' })
  readonly answers: string[];

  @Min(0, { message: 'Correct answer index must be 0 or greater' })
  @Max(4, { message: 'Correct answer index can be at most 5' })
  readonly correctAnswerIndex: number;
}
