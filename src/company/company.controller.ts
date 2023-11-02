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
import { User } from 'src/decorators/user.decorator';
import { DtoValidationPipe } from 'src/pipes/dtoValidation.pipe';
import { PageDto } from 'src/pagination/dto/page.dto';
import { PageOptionsDto } from 'src/pagination/dto/page-options.dto';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { ChangeVisibilityDto } from './dto/changeVisibility.dto';
import { ICompanyResponse } from './types/company-response.interface';
import { IMessage } from 'src/types';
import { CompanyEntity } from './company.entity';
import { UserEntity } from 'src/user/user.entity';
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

  @Get('members/:companyId')
  @UseGuards(AuthGuard)
  async getAllMembers(
    @Param('companyId') companyId: string,
  ): Promise<{ members: UserEntity[] }> {
    return this.companyService.getAllMembers(+companyId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
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

  @Post('change-visibility/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async changeCompanyVisibility(
    @User('id') userId: number,
    @Param('id') companyIdToUpdate: string,
    @Body() changeVisibilityDto: ChangeVisibilityDto,
  ): Promise<IMessage> {
    return this.companyService.changeCompanyVisibility(
      userId,
      Number(companyIdToUpdate),
      changeVisibilityDto,
    );
  }

  @Delete(':companyId/member/:memberId')
  @UseGuards(AuthGuard)
  async removeMember(
    @User('id') ownerId: number,
    @Param('memberId') memberId: string,
    @Param('companyId') companyId: string,
  ): Promise<IMessage> {
    return this.companyService.removeMember(ownerId, +companyId, +memberId);
  }

  @Delete('leave/:companyId')
  @UseGuards(AuthGuard)
  async leaveCompany(
    @User('id') memberId: number,
    @Param('companyId') companyId: string,
  ): Promise<IMessage> {
    return this.companyService.leaveCompany(memberId, +companyId);
  }
}
