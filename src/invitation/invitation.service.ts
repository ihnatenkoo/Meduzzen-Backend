import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InvitationEntity } from './invitation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInvitationDto } from './dto/createInvitation.dto';
import { RespondInvitationDto } from './dto/respondInvitation.dto';
import { IMessage } from 'src/types';
import { EInvitationStatus } from './types/invitation-status';
import { UserEntity } from 'src/user/user.entity';
import { ACCESS_DENIED, USER_NOT_FOUND } from 'src/constants';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(InvitationEntity)
    private readonly invitationRepository: Repository<InvitationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getInvitations(
    userId: number,
  ): Promise<{ invitations: InvitationEntity[] }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['receivedInvitations'],
    });

    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return { invitations: user.receivedInvitations };
  }

  async createInvitation(
    userId: number,
    { companyId, recipientId }: CreateInvitationDto,
  ): Promise<IMessage> {
    const sender = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ownerCompanies'],
    });

    if (!sender) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const company = sender.ownerCompanies.find(
      (company) => company.id === companyId,
    );

    if (!company) {
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    const recipient = await this.userRepository.findOne({
      where: { id: recipientId },
    });

    if (!recipient) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const invitation = await this.invitationRepository.findOne({
      where: {
        sender: { id: sender.id },
        recipient: { id: recipientId },
        company: { id: companyId },
      },
    });

    if (invitation) {
      throw new HttpException(
        'Invitation already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.invitationRepository.save({ sender, recipient, company });

    return { message: 'Invitation successfully created' };
  }

  async cancelInvitation(
    userId: number,
    invitationId: number,
  ): Promise<IMessage> {
    const sender = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['sentInvitations'],
    });

    if (!sender) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const invitation = sender.sentInvitations.find(
      (invitation) => invitation.id === invitationId,
    );

    if (!invitation) {
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    const updatedInvitation = this.invitationRepository.merge(invitation, {
      status: EInvitationStatus.CANCELED,
    });

    await this.invitationRepository.save(updatedInvitation);

    return { message: 'Invitation successfully canceled' };
  }

  async respondToInvitation(
    userId: number,
    invitationId: number,
    { respond }: RespondInvitationDto,
  ): Promise<IMessage> {
    const recipient = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['receivedInvitations', 'memberInCompanies'],
    });

    if (!recipient) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const invitation = recipient.receivedInvitations.find(
      (invitation) => invitation.id === invitationId,
    );

    if (!invitation) {
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    if (invitation.status !== EInvitationStatus.PENDING) {
      throw new HttpException('Invitation not active', HttpStatus.FORBIDDEN);
    }

    if (respond === EInvitationStatus.ACCEPTED) {
      recipient.memberInCompanies.push(invitation.company);
      await this.userRepository.save(recipient);
    }

    const updatedInvitation = this.invitationRepository.merge(invitation, {
      status: respond,
    });

    await this.invitationRepository.save(updatedInvitation);

    return { message: `Invitation successfully ${respond}` };
  }
}
