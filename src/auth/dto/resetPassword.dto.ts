import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';
import { IsValidPassword } from 'src/decorators/password-validation.decorator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsJWT()
  readonly token: string;

  @ApiProperty()
  @IsValidPassword()
  readonly password: string;
}
