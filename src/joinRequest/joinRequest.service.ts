import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { JoinRequestEntity } from './joinRequest.entity';
import { CompanyEntity } from 'src/company/company.entity';
import { EInvitationStatus } from 'src/invitation/types/invitation-status';
import { IMessage } from 'src/types';
import { RespondJoinRequestDto } from './dto/respondJoinRequest.dto';
import {
  ACCESS_DENIED,
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

  async getJoinRequestsList(userId: number): Promise<{
    joinRequests: JoinRequestEntity[];
  }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['sentJoinRequests'],
    });

    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

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

  async respondJoinRequest(
    userId: number,
    companyId: number,
    respondDto: RespondJoinRequestDto,
  ): Promise<IMessage> {
    const owner = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!owner) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const candidate = await this.userRepository.findOne({
      where: { id: respondDto.candidateId },
    });

    if (!candidate) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['owner', 'members', 'joinRequests.sender'],
    });

    if (!company) {
      throw new HttpException(COMPANY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const joinRequest = company.joinRequests.find(
      (request) =>
        request.sender.id === respondDto.candidateId &&
        request.status === EInvitationStatus.PENDING,
    );

    if (!joinRequest) {
      throw new HttpException('Active request not found', HttpStatus.NOT_FOUND);
    }

    if (company.owner.id !== owner.id) {
      this.logger.error(
        `User ${owner.email} tried to process request in company ${company.id}`,
      );
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    if (respondDto.respond === EInvitationStatus.ACCEPTED) {
      company.members.push(candidate);
      await this.companyRepository.save(company);
    }

    this.joinRequestRepository.merge(joinRequest, {
      status: respondDto.respond,
    });

    await this.joinRequestRepository.save(joinRequest);

    this.logger.log(
      `Request id:${joinRequest.id} status updated to ${respondDto.respond}`,
    );

    return { message: `User request ${respondDto.respond}` };
  }
}
