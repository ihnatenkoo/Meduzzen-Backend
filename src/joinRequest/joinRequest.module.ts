import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CompanyModule } from 'src/company/company.module';
import { JoinRequestEntity } from './joinRequest.entity';
import { JoinRequestController } from './joinRequest.controller';
import { JoinRequestService } from './joinRequest.service';

@Module({
  imports: [
    UserModule,
    CompanyModule,
    TypeOrmModule.forFeature([JoinRequestEntity]),
  ],
  controllers: [JoinRequestController],
  providers: [JoinRequestService],
})
export class JoinRequestModule {}
