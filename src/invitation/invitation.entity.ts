import { CompanyEntity } from 'src/company/company.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EInvitationStatus } from './types/invitation-status';

@Entity({ name: 'invitations' })
export class InvitationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.sentInvitations)
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedInvitations)
  recipient: UserEntity;

  @ManyToOne(() => CompanyEntity, (company) => company.invitations, {
    eager: true,
  })
  company: CompanyEntity;

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
}
