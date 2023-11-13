import { CompanyEntity } from 'src/company/company.entity';
import { UserEntity } from 'src/user/user.entity';

export interface INotification {
  text: string;
  type: ENotificationType;
  user: UserEntity;
  company?: CompanyEntity;
}

export enum ENotificationType {
  SYSTEM = 'system',
  COMPANY = 'company',
}

export enum ENotificationStatus {
  READ = 'read',
  UNREAD = 'unread',
}
