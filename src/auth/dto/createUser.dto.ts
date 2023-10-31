import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';
import { IsValidPassword } from 'src/decorators/password-validation.decorator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  readonly email: string;

  @IsValidPassword()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsUrl()
  readonly avatar?: string;
}
