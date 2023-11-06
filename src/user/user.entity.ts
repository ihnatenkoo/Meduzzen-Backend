import { CompanyEntity } from 'src/company/company.entity';
import { InvitationEntity } from 'src/invitation/invitation.entity';
import { JoinRequestEntity } from 'src/joinRequest/joinRequest.entity';
import { QuizResultEntity } from 'src/quiz-result/quiz-result.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToMany(() => JoinRequestEntity, (joinRequest) => joinRequest.sender)
  sentJoinRequests: JoinRequestEntity[];

  @OneToMany(() => QuizResultEntity, (quiz) => quiz.user)
  completedQuizzes: QuizResultEntity[];

  @ManyToMany(() => CompanyEntity, (company) => company.members)
  memberInCompanies: CompanyEntity[];

  @ManyToMany(() => CompanyEntity, (company) => company.admins)
  @JoinTable()
  adminInCompanies: CompanyEntity[];
}
