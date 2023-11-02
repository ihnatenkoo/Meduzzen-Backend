import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from './company.entity';
import { UserEntity } from 'src/user/user.entity';
import { InvitationEntity } from 'src/invitation/invitation.entity';
import { JoinRequestEntity } from 'src/joinRequest/joinRequest.entity';
import { ICompanyResponse } from './types/company-response.interface';
import { IMessage } from 'src/types';
import { PageDto } from 'src/pagination/dto/page.dto';
import { PageOptionsDto } from 'src/pagination/dto/page-options.dto';
import { ChangeVisibilityDto } from './dto/changeVisibility.dto';
import { paginate } from 'src/pagination/paginate';
import {
  ACCESS_DENIED,
  COMPANY_DELETED_SUCCESSFULLY,
  COMPANY_NOT_FOUND,
  VISIBILITY_MODIFIED_SUCCESSFULLY,
} from 'src/constants';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createCompany(
    userId: number,
    createCompanyDto: CreateCompanyDto,
  ): Promise<ICompanyResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const company = await this.companyRepository.save({
      ...createCompanyDto,
      owner: user,
    });

    this.logger.log(`New company created. Name: ${company.name}`);

    return { company };
  }

  async findCompanyById(id: number): Promise<ICompanyResponse> {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new HttpException(COMPANY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return { company };
  }

  async getAllMembers(companyId: number): Promise<{ members: UserEntity[] }> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['members'],
    });

    if (!company) {
      throw new HttpException(COMPANY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return { members: company.members };
  }

  async getInvitations(
    userId: number,
    companyId: number,
  ): Promise<{
    invitations: InvitationEntity[];
  }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ownerCompanies.invitations.sender'],
    });

    const company = user.ownerCompanies.find(
      (company) => company.id === companyId,
    );

    if (!company) {
      this.logger.error(
        `Access denied! User ${user.email} try to get invitations in company id:${companyId}`,
      );

      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    return { invitations: company.invitations };
  }

  async getJoinRequests(
    userId: number,
    companyId: number,
  ): Promise<{
    joinRequests: JoinRequestEntity[];
  }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ownerCompanies.joinRequests.sender'],
    });

    const company = user.ownerCompanies.find(
      (company) => company.id === companyId,
    );

    if (!company) {
      this.logger.error(
        `Access denied! User ${user.email} try to get joinRequests in company id:${companyId}`,
      );

      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    return { joinRequests: company.joinRequests };
  }

  async getAllCompanies(
    query: PageOptionsDto,
  ): Promise<PageDto<CompanyEntity>> {
    return paginate<CompanyEntity>({
      name: 'company',
      orderBy: 'company.id',
      query,
      observeVisibility: true,
      repository: this.companyRepository,
    });
  }

  async getAdminsList(companyId: number) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['admins'],
    });

    if (!company) {
      throw new HttpException(COMPANY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return { admins: company.admins };
  }

  async updateCompany(
    userId: number,
    companyIdToUpdate: number,
    updateCompanyDto: CreateCompanyDto,
  ): Promise<ICompanyResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ownerCompanies'],
    });

    const { company: existedCompany } =
      await this.findCompanyById(companyIdToUpdate);

    if (
      !user.ownerCompanies.some((company) => company.id === companyIdToUpdate)
    ) {
      this.logger.error(
        `Access denied! User ${user.email} try to update company id:${companyIdToUpdate}`,
      );

      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    const updatedCompany = this.companyRepository.merge(
      existedCompany,
      updateCompanyDto,
    );

    const company = await this.companyRepository.save(updatedCompany);

    this.logger.log(`Company ${updatedCompany.name} updated successfully`);

    return { company };
  }

  async deleteCompany(
    userId: number,
    companyIdToDelete: number,
  ): Promise<IMessage> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ownerCompanies'],
    });

    if (
      !user.ownerCompanies.some((company) => company.id === companyIdToDelete)
    ) {
      this.logger.error(
        `Access denied! User ${user.email} try to delete company id:${companyIdToDelete}`,
      );

      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    await this.companyRepository.delete(companyIdToDelete);

    this.logger.log(
      `${COMPANY_DELETED_SUCCESSFULLY}. Company id:${companyIdToDelete}`,
    );

    return { message: COMPANY_DELETED_SUCCESSFULLY };
  }

  async changeCompanyVisibility(
    userId: number,
    companyIdToUpdate: number,
    changeVisibilityDto: ChangeVisibilityDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ownerCompanies'],
    });

    if (
      !user.ownerCompanies.some((company) => company.id === companyIdToUpdate)
    ) {
      this.logger.error(
        `Access denied! User ${user.email} try to change visibility in company id:${companyIdToUpdate}`,
      );

      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    const { company } = await this.findCompanyById(companyIdToUpdate);

    const updatedCompany = this.companyRepository.merge(
      company,
      changeVisibilityDto,
    );

    await this.companyRepository.save(updatedCompany);

    this.logger.log(
      `${VISIBILITY_MODIFIED_SUCCESSFULLY}. Company id:${companyIdToUpdate}`,
    );

    return { message: VISIBILITY_MODIFIED_SUCCESSFULLY };
  }

  async removeMember(
    ownerId: number,
    companyId: number,
    memberId: number,
  ): Promise<IMessage> {
    const user = await this.userRepository.findOne({
      where: { id: ownerId },
      relations: ['ownerCompanies.members'],
    });

    const company = user.ownerCompanies.find(
      (company) => company.id === companyId,
    );

    if (!company) {
      this.logger.error(
        `Access denied! User ${user.email} try to remove user in company id:${companyId}`,
      );

      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    const member = company.members.find((member) => member.id === memberId);

    if (!member) {
      throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
    }

    company.members = company.members.filter(
      (member) => member.id !== memberId,
    );

    await this.companyRepository.save(company);

    this.logger.log(
      `Member id:${memberId} successfully removed from company id:${company.id}`,
    );

    return { message: 'Member successfully removed' };
  }

  async removeAdmin(
    ownerId: number,
    companyId: number,
    adminId: number,
  ): Promise<IMessage> {
    const user = await this.userRepository.findOne({
      where: { id: ownerId },
      relations: ['ownerCompanies.admins'],
    });

    const company = user.ownerCompanies.find(
      (company) => company.id === companyId,
    );

    if (!company) {
      this.logger.error(
        `Access denied! User ${user.email} try to remove admin in company id:${companyId}`,
      );

      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    const admin = company.admins.find((admin) => admin.id === adminId);

    if (!admin) {
      throw new HttpException('User is not admin', HttpStatus.BAD_REQUEST);
    }

    company.admins = company.admins.filter((admin) => admin.id !== adminId);

    await this.companyRepository.save(company);

    this.logger.log(
      `Admin id:${adminId} successfully removed from admins in company id:${company.id}`,
    );

    return { message: 'Admin successfully removed' };
  }

  async leaveCompany(memberId: number, companyId: number): Promise<IMessage> {
    const user = await this.userRepository.findOne({
      where: { id: memberId },
      relations: ['memberInCompanies'],
    });

    if (!user.memberInCompanies.some((company) => company.id === companyId)) {
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    user.memberInCompanies = user.memberInCompanies.filter(
      (company) => company.id !== companyId,
    );

    await this.userRepository.save(user);

    this.logger.log(
      `Member id:${memberId} successfully left from the company id:${companyId}`,
    );

    return { message: 'Member successfully left' };
  }

  async addAdmin(
    ownerId: number,
    companyId: number,
    adminId: number,
  ): Promise<IMessage> {
    const owner = await this.userRepository.findOne({
      where: { id: ownerId },
      relations: ['ownerCompanies.members', 'ownerCompanies.admins'],
    });

    const company = owner.ownerCompanies.find(
      (company) => company.id === companyId,
    );

    if (!company) {
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }

    const candidate = company.members.find((member) => member.id === adminId);

    if (!candidate) {
      throw new HttpException(
        'User is not a member of your company',
        HttpStatus.NOT_FOUND,
      );
    }

    if (company.admins.some((admin) => admin.id === candidate.id)) {
      throw new HttpException(
        'User is already an administrator',
        HttpStatus.BAD_REQUEST,
      );
    }

    company.admins.push(candidate);
    await this.companyRepository.save(company);

    this.logger.log(
      `User ${candidate.email} successfully added to admins in company id:${company.id}`,
    );

    return { message: 'User successfully added to admins' };
  }
}
