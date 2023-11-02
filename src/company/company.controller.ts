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
import { InvitationEntity } from 'src/invitation/invitation.entity';
import { JoinRequestEntity } from 'src/joinRequest/joinRequest.entity';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('list')
  async getAllCompanies(
    @Query() query: PageOptionsDto,
  ): Promise<PageDto<CompanyEntity>> {
    return this.companyService.getAllCompanies(query);
  }

  @Get('admins-list/:companyId')
  @UseGuards(AuthGuard)
  async getAdminsList(@Param('companyId') companyId: string) {
    return this.companyService.getAdminsList(+companyId);
  }

  @Get('invitations/:companyId')
  @UseGuards(AuthGuard)
  async getInvitations(
    @User('id') userId: number,
    @Param('companyId') companyId: string,
  ): Promise<{
    invitations: InvitationEntity[];
  }> {
    return this.companyService.getInvitations(userId, +companyId);
  }

  @Get('join-requests/:companyId')
  @UseGuards(AuthGuard)
  async getJoinRequests(
    @User('id') userId: number,
    @Param('companyId') companyId: string,
  ): Promise<{
    joinRequests: JoinRequestEntity[];
  }> {
    return this.companyService.getJoinRequests(userId, +companyId);
  }

  @Get('members/:companyId')
  @UseGuards(AuthGuard)
  async getAllMembers(
    @Param('companyId') companyId: string,
  ): Promise<{ members: UserEntity[] }> {
    return this.companyService.getAllMembers(+companyId);
  }

  @Get(':companyId/add-admin/:adminId')
  @UseGuards(AuthGuard)
  async addAdmin(
    @User('id') ownerId: number,
    @Param('companyId') companyId: string,
    @Param('adminId') adminId: string,
  ): Promise<IMessage> {
    return this.companyService.addAdmin(ownerId, +companyId, +adminId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findCompanyById(@Param('id') id: number): Promise<ICompanyResponse> {
    return this.companyService.findCompanyById(id);
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @UsePipes(new DtoValidationPipe())
  async createCompany(
    @User('id') userId: number,
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<ICompanyResponse> {
    return this.companyService.createCompany(userId, createCompanyDto);
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
      +companyIdToUpdate,
      changeVisibilityDto,
    );
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
      +companyIdToUpdate,
      updateCompanyDto,
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

  @Delete(':companyId/admin/:adminId')
  @UseGuards(AuthGuard)
  async removeAdmin(
    @User('id') ownerId: number,
    @Param('adminId') adminId: string,
    @Param('companyId') companyId: string,
  ): Promise<IMessage> {
    return this.companyService.removeAdmin(ownerId, +companyId, +adminId);
  }

  @Delete('leave/:companyId')
  @UseGuards(AuthGuard)
  async leaveCompany(
    @User('id') memberId: number,
    @Param('companyId') companyId: string,
  ): Promise<IMessage> {
    return this.companyService.leaveCompany(memberId, +companyId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCompany(
    @User('id') userId: number,
    @Param('id') companyIdToDelete: string,
  ): Promise<IMessage> {
    return this.companyService.deleteCompany(userId, +companyIdToDelete);
  }
}
