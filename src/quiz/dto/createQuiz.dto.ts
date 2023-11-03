import { IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  @Length(5, 20)
  readonly name: string;

  @IsString()
  @Length(5, 120)
  readonly description: string;

  @IsNumber()
  @Min(1)
  readonly frequency: number;
}
