import { IsNumber } from 'class-validator';

export class CreateInvitationDto {
  @IsNumber()
  readonly recipientId: number;

  @IsNumber()
  readonly companyId: number;
}
