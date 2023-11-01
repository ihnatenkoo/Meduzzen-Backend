import { IsString, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @Length(5, 20)
  name: string;

  @IsString()
  description: string;
}
