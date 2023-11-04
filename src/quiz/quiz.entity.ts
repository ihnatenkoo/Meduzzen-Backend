import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from 'src/company/company.entity';
import { QuestionEntity } from 'src/question/question.entity';
import { QuizzesResultsEntity } from 'src/quiz-result/quiz-result.entity';

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

  @ManyToOne(() => CompanyEntity, (company) => company.quizzes)
  company: CompanyEntity;

  @OneToMany(() => QuestionEntity, (question) => question.quiz)
  questions: QuestionEntity[];

  @OneToMany(() => QuizzesResultsEntity, (quizResult) => quizResult.quiz)
  completedQuizzes: QuizzesResultsEntity[];
}
