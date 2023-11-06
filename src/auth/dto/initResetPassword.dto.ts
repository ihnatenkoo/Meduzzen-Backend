import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class InitResetPasswordDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email' })
  readonly email: string;
}
