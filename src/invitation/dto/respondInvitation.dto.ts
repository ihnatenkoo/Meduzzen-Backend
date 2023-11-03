import { IsIn } from 'class-validator';
import { EInvitationStatus } from '../types/invitation-status';

type TRespond = EInvitationStatus.ACCEPTED | EInvitationStatus.REJECTED;

export class RespondInvitationDto {
  @IsIn([EInvitationStatus.ACCEPTED, EInvitationStatus.REJECTED])
  readonly respond: TRespond;
}
