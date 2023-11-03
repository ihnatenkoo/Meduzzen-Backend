import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from 'src/company/company.entity';
import { QuestionEntity } from 'src/question/question.entity';

@Entity({ name: 'quizzes' })
export class QuizEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  frequency: number;

  @ManyToOne(() => CompanyEntity, (company) => company)
  company: CompanyEntity;

  @OneToMany(() => QuestionEntity, (question) => question.quiz)
  questions: QuestionEntity[];
}
