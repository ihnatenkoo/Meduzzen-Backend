import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  @Length(5, 20)
  name: string;

  @ApiProperty()
  @IsString()
  description: string;
}
