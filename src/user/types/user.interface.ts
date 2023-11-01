import { CompanyEntity } from 'src/company/company.entity';

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  bio: string;
  avatar: string;
  ownerCompanies: CompanyEntity[];
}
