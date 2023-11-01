import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InvitationEntity } from './invitation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInvitationDto } from './dto/createInvitation.dto';
import { UserEntity } from 'src/user/user.entity';
import { IMessage } from 'src/types';
import { ACCESS_DENIED, USER_NOT_FOUND } from 'src/constants';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(InvitationEntity)
    private readonly invitationRepository: Repository<InvitationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

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

  //TODO: for test
  async findAll(): Promise<InvitationEntity[]> {
    return this.invitationRepository.find({
      relations: ['sender', 'recipient', 'company'],
    });
  }
}
