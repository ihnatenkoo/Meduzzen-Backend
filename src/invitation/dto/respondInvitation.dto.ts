import { IsIn } from 'class-validator';
import { EInvitationStatus } from '../types/invitation-status';
import { ApiProperty } from '@nestjs/swagger';

type TRespond = EInvitationStatus.ACCEPTED | EInvitationStatus.REJECTED;

export class RespondInvitationDto {
  @ApiProperty({
    default: EInvitationStatus.ACCEPTED,
    description: `${EInvitationStatus.ACCEPTED} or ${EInvitationStatus.REJECTED}`,
  })
  @IsIn([EInvitationStatus.ACCEPTED, EInvitationStatus.REJECTED])
  readonly respond: TRespond;
}
