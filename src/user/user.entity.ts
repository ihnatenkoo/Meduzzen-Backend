import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  avatar: string;
}
