import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { InvitationEntity } from 'src/invitation/invitation.entity';

@Entity({ name: 'companies' })
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: true, select: false })
  isPublic: boolean;

  @ManyToOne(() => UserEntity, (user) => user.ownerCompanies)
  owner: UserEntity;

  @OneToMany(() => InvitationEntity, (invitation) => invitation.company)
  invitations: InvitationEntity[];

  @ManyToMany(() => UserEntity, (user) => user.memberInCompanies)
  @JoinTable()
  members: UserEntity[];
}
