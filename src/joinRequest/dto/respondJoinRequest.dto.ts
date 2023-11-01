import { IsIn, IsNumber } from 'class-validator';
import { EInvitationStatus } from 'src/invitation/types/invitation-status';

type TRespond = EInvitationStatus.ACCEPTED | EInvitationStatus.REJECTED;

export class RespondJoinRequestDto {
  @IsIn([EInvitationStatus.ACCEPTED, EInvitationStatus.REJECTED])
  readonly respond: TRespond;

  @IsNumber()
  readonly candidateId: number;
}
