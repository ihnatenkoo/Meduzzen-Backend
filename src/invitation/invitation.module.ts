import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { InvitationEntity } from './invitation.entity';
import { CompanyModule } from 'src/company/company.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    CompanyModule,
    TypeOrmModule.forFeature([InvitationEntity]),
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
