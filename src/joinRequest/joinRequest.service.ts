import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { JoinRequestEntity } from './joinRequest.entity';
import { CompanyEntity } from 'src/company/company.entity';
import { EInvitationStatus } from 'src/invitation/types/invitation-status';
import { IMessage } from 'src/types';
import {
  COMPANY_NOT_FOUND,
  JOIN_REQUEST_CANCELED,
  JOIN_REQUEST_CREATED,
  USER_NOT_FOUND,
} from 'src/constants';

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

  async createJoinRequest(
    userId: number,
    companyId: number,
  ): Promise<IMessage> {
    const sender = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['sentJoinRequests'],
    });

    if (!sender) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['owner'],
    });

    if (!company) {
      throw new HttpException(COMPANY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (company.owner.id === userId) {
      throw new HttpException('You are a group maker', HttpStatus.BAD_REQUEST);
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

    if (!sender) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

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
}
