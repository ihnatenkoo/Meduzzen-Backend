import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

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
}
