import { Socket } from 'socket.io';

export interface ISocketWithUserId extends Socket {
  userId?: number;
}
