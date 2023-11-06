import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsValidPassword } from 'src/decorators/password-validation.decorator';

export class LoginDto {
  @ApiProperty({ default: 'test@test.com' })
  @IsEmail({}, { message: 'Invalid email' })
  readonly email: string;

  @ApiProperty({ default: 'Test2023' })
  @IsValidPassword()
  readonly password: string;
}
