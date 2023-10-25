import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ select: false })
  hashPassword: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  avatar: string;
}
