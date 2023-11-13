import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ENotificationStatus, ENotificationType } from './types';
import { UserEntity } from 'src/user/user.entity';
import { CompanyEntity } from 'src/company/company.entity';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ type: 'enum', enum: ENotificationType })
  type: ENotificationType;

  @Column({
    type: 'enum',
    enum: ENotificationStatus,
    default: ENotificationStatus.UNREAD,
  })
  status: ENotificationStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CompanyEntity, (company) => company.notifications)
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;
}
