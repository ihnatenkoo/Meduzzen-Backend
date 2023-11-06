import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty()
  @IsNumber()
  readonly recipientId: number;

  @ApiProperty()
  @IsNumber()
  readonly companyId: number;
}
