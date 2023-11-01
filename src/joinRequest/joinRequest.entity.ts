import { CompanyEntity } from 'src/company/company.entity';
import { EInvitationStatus } from 'src/invitation/types/invitation-status';
import { UserEntity } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'join_requests' })
export class JoinRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: EInvitationStatus.PENDING })
  status: EInvitationStatus;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.sentJoinRequests)
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  @ManyToOne(() => CompanyEntity, (company) => company.joinRequests)
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;
}
