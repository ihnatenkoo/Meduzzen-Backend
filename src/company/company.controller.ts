import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { User } from 'src/decorators/user.decorator';
import { ICompanyResponse } from './types/company-response.interface';
import { IMessage } from 'src/types';
import { PageDto } from 'src/pagination/dto/page.dto';
import { PageOptionsDto } from 'src/pagination/dto/page-options.dto';
import { CompanyEntity } from './company.entity';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async createCompany(
    @User('id') userId: number,
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<ICompanyResponse> {
    return this.companyService.createCompany(userId, createCompanyDto);
  }

  @Get('list')
  async getAllCompanies(
    @Query() query: PageOptionsDto,
  ): Promise<PageDto<CompanyEntity>> {
    return this.companyService.getAllCompanies(query);
  }

  @Get(':id')
  async findCompanyById(@Param('id') id: number): Promise<ICompanyResponse> {
    return this.companyService.findCompanyById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async updateCompany(
    @User('id') userId: number,
    @Param('id') companyIdToUpdate: string,
    @Body() updateCompanyDto: CreateCompanyDto,
  ): Promise<ICompanyResponse> {
    return this.companyService.updateCompany(
      userId,
      Number(companyIdToUpdate),
      updateCompanyDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCompany(
    @User('id') userId: number,
    @Param('id') companyIdToDelete: string,
  ): Promise<IMessage> {
    return this.companyService.deleteCompany(userId, Number(companyIdToDelete));
  }
}
