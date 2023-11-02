import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { JoinRequestEntity } from './joinRequest.entity';
import { CompanyEntity } from 'src/company/company.entity';
import { EInvitationStatus } from 'src/invitation/types/invitation-status';
import { IMessage } from 'src/types';
import {
  ACCESS_DENIED,
  COMPANY_NOT_FOUND,
  JOIN_REQUEST_CANCELED,
  JOIN_REQUEST_CREATED,
} from 'src/constants';
import { RespondInvitationDto } from 'src/invitation/dto/respondInvitation.dto';

@Injectable()
export class JoinRequestService {
  private readonly logger = new Logger(JoinRequestService.name);

  constructor(
    @InjectRepository(JoinRequestEntity)
    private readonly joinRequestRepository: Repository<JoinRequestEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async getJoinRequestsList(userId: number): Promise<{
    joinRequests: JoinRequestEntity[];
  }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['sentJoinRequests'],
    });

    return { joinRequests: user.sentJoinRequests };
  }

  async createJoinRequest(
    userId: number,
    companyId: number,
  ): Promise<IMessage> {
    const sender = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['sentJoinRequests'],
    });

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['owner'],
    });

    if (!company) {
      throw new HttpException(COMPANY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (company.owner.id === userId) {
      throw new HttpException(
        'You are a company owner',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      sender.sentJoinRequests.some(
        (request) =>
          request.company.id === companyId &&
          request.status === EInvitationStatus.PENDING,
      )
    ) {
      throw new HttpException(
        'Request already created',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.joinRequestRepository.save({ sender, company });

    this.logger.log(
      `${JOIN_REQUEST_CREATED}. User ${sender.email} to company ${company.name}`,
    );

    return { message: JOIN_REQUEST_CREATED };
  }

  async cancelJoinRequest(
    userId: number,
    companyId: number,
  ): Promise<IMessage> {
    const sender = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['sentJoinRequests'],
    });

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new HttpException(COMPANY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const activeRequest = sender.sentJoinRequests.find(
      (request) =>
        request.company.id === companyId &&
        request.status === EInvitationStatus.PENDING,
    );

    if (!activeRequest) {
      throw new HttpException('Active request not found', HttpStatus.NOT_FOUND);
    }

    this.joinRequestRepository.merge(activeRequest, {
      status: EInvitationStatus.CANCELED,
    });

    await this.joinRequestRepository.save(activeRequest);

    this.logger.log(
      `${JOIN_REQUEST_CANCELED}. User ${sender.email} to company ${company.name}`,
    );

    return { message: JOIN_REQUEST_CANCELED };
  }

  async respondJoinRequest(
    userId: number,
    joinRequestId: number,
    { respond }: RespondInvitationDto,
  ): Promise<IMessage> {
    const joinRequest = await this.joinRequestRepository.findOne({
      where: { id: joinRequestId },
      relations: ['company.owner', 'sender.memberInCompanies'],
    });

    if (!joinRequest || joinRequest.status !== EInvitationStatus.PENDING) {
      throw new HttpException('Active request not found', HttpStatus.NOT_FOUND);
    }

    if (joinRequest.company.owner.id !== userId) {
      this.logger.error(
        `User id:${userId} tried to process join request where company owner id:${joinRequest.company.owner.id}`,
      );
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    if (respond === EInvitationStatus.ACCEPTED) {
      joinRequest.sender.memberInCompanies.push(joinRequest.company);
      await this.userRepository.save(joinRequest.sender);
    }

    this.joinRequestRepository.merge(joinRequest, {
      status: respond,
    });

    await this.joinRequestRepository.save(joinRequest);

    this.logger.log(
      `Request id:${joinRequest.id} status updated to ${respond}`,
    );

    return { message: `User request ${respond}` };
  }
}
