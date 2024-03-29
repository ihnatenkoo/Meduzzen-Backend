import { CompanyEntity } from 'src/company/company.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IQuizResultDetail } from './interfaces';
import { QuizEntity } from 'src/quiz/quiz.entity';
import { UserEntity } from 'src/user/user.entity';

@Entity({ name: 'quizzes_results' })
export class QuizResultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  correctAnswers: number;

  @Column()
  totalQuestions: number;

  @Column({ type: 'float' })
  ratio: number;

  @Column('jsonb')
  details: IQuizResultDetail[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  finalTime: Date;

  @ManyToOne(() => UserEntity, (user) => user.completedQuizzes)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CompanyEntity, (company) => company.completedQuizzes)
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.completedQuizzes)
  @JoinColumn({ name: 'quiz_id' })
  quiz: QuizEntity;
}
