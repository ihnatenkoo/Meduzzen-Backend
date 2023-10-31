import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { User } from 'src/decorators/user.decorator';
import { CompanyService } from './company.service';
import { ICompanyResponse } from './types/company-response.interface';

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

  @Get(':id')
  async findCompanyById(@Param('id') id: number): Promise<ICompanyResponse> {
    return this.companyService.findCompanyById(id);
  }
}
