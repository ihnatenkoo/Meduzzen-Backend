import { CompanyEntity } from 'src/company/company.entity';
import { InvitationEntity } from 'src/invitation/invitation.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => CompanyEntity, (company) => company.owner)
  ownerCompanies: CompanyEntity[];

  @OneToMany(() => InvitationEntity, (invitation) => invitation.sender)
  sentInvitations: InvitationEntity[];

  @OneToMany(() => InvitationEntity, (invitation) => invitation.recipient)
  receivedInvitations: InvitationEntity[];
}
