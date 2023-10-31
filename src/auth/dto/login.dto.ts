import { IsEmail } from 'class-validator';
import { IsValidPassword } from 'src/decorators/password-validation.decorator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email' })
  readonly email: string;

  @IsValidPassword()
  readonly password: string;
}
