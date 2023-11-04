import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { InvitationEntity } from 'src/invitation/invitation.entity';
import { JoinRequestEntity } from 'src/joinRequest/joinRequest.entity';
import { QuizEntity } from 'src/quiz/quiz.entity';
import { QuizzesResultsEntity } from 'src/quiz-result/quiz-result.entity';

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
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @OneToMany(() => InvitationEntity, (invitation) => invitation.company)
  invitations: InvitationEntity[];

  @OneToMany(() => JoinRequestEntity, (joinRequest) => joinRequest.company)
  joinRequests: JoinRequestEntity[];

  @OneToMany(() => QuizEntity, (quiz) => quiz.company)
  quizzes: QuizEntity[];

  @OneToMany(() => QuizzesResultsEntity, (quiz) => quiz.company)
  completedQuizzes: QuizzesResultsEntity[];

  @ManyToMany(() => UserEntity, (user) => user.memberInCompanies)
  @JoinTable()
  members: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.adminInCompanies)
  admins: UserEntity[];
}
