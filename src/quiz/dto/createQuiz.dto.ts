import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateQuizDto {
  @ApiProperty()
  @IsString()
  @Length(5, 20)
  readonly name: string;

  @ApiProperty()
  @IsString()
  @Length(5, 120)
  readonly description: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @Min(1)
  readonly frequency: number;
}

export class UpdateQuizDto extends PartialType(CreateQuizDto) {}
