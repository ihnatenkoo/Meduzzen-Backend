import { CompanyEntity } from 'src/company/company.entity';
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
import { EInvitationStatus } from './types/invitation-status';

@Entity({ name: 'invitations' })
export class InvitationEntity {
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

  @ManyToOne(() => UserEntity, (user) => user.sentInvitations)
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedInvitations)
  @JoinColumn({ name: 'recipient_id' })
  recipient: UserEntity;

  @ManyToOne(() => CompanyEntity, (company) => company.invitations, {
    eager: true,
  })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;
}
