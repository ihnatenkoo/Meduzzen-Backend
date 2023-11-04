import { QuizEntity } from 'src/quiz/quiz.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'questions' })
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column({ type: 'text', array: true, default: [] })
  answers: string[];

  @Column()
  correctAnswerIndex: number;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.questions)
  quiz: QuizEntity;
}
