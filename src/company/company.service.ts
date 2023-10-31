import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from './company.entity';
import { UserEntity } from 'src/user/user.entity';
import { COMPANY_NOT_FOUND, USER_NOT_FOUND } from 'src/constants';
import { ICompanyResponse } from './types/company-response.interface';

@Injectable()
export class CompanyService {
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
}
