import { IsJWT } from 'class-validator';
import { IsValidPassword } from 'src/decorators/password-validation.decorator';

export class ResetPasswordDto {
  @IsJWT()
  readonly token: string;

  @IsValidPassword()
  readonly password: string;
}
