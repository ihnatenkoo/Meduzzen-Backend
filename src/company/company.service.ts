import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from './company.entity';
import { UserEntity } from 'src/user/user.entity';
import { ICompanyResponse } from './types/company-response.interface';
import { IMessage } from 'src/types';
import { PageDto } from 'src/pagination/dto/page.dto';
import { PageOptionsDto } from 'src/pagination/dto/page-options.dto';
import { ChangeVisibilityDto } from './dto/changeVisability.dto';
import { paginate } from 'src/pagination/paginate';
import {
  ACCESS_DENIED,
  COMPANY_DELETED_SUCCESSFULLY,
  COMPANY_NOT_FOUND,
  USER_NOT_FOUND,
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

    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

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

  async updateCompany(
    userId: number,
    companyIdToUpdate: number,
    updateCompanyDto: CreateCompanyDto,
  ): Promise<ICompanyResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['ownerCompanies'],
    });

    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

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

    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

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
      `${COMPANY_DELETED_SUCCESSFULLY}. Company id: ${companyIdToDelete}`,
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

    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (
      !user.ownerCompanies.some((company) => company.id === companyIdToUpdate)
    ) {
      this.logger.error(
        `Access denied! User ${user.email} try to change visibility in company id: ${companyIdToUpdate}`,
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
      `${VISIBILITY_MODIFIED_SUCCESSFULLY}. Company id: ${companyIdToUpdate}`,
    );

    return { message: VISIBILITY_MODIFIED_SUCCESSFULLY };
  }
}
