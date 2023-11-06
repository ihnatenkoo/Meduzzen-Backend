import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';
import { IsValidPassword } from 'src/decorators/password-validation.decorator';

export class CreateUserDto {
  @ApiProperty({ default: 'test@test.com' })
  @IsEmail({}, { message: 'Invalid email' })
  readonly email: string;

  @ApiProperty({ default: 'Test2023' })
  @IsValidPassword()
  readonly password: string;

  @ApiProperty({ required: false, default: null })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: false, default: null })
  @IsOptional()
  @IsUrl()
  readonly avatar?: string;
}
