import { UserEntity } from '../user.entity';

export interface IUserResponse {
  user: UserEntity;
}

export interface IRatio {
  userId: number;
  ratio: number;
}
