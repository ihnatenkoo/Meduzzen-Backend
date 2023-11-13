import { Socket } from 'socket.io';

export interface ISocketWithUserId extends Socket {
  userId?: number;
}

export enum SocketEvents {
  SEND_EVENT = 'send_event',
}

export interface IMessageToRoom {
  room: string;
  text: string;
}
