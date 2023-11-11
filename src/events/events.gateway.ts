import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsAuthGuard } from 'src/guards/ws-auth.guard';
import { ISocketWithUserId } from './types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(WsAuthGuard)
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(EventsGateway.name);
  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: ISocketWithUserId) {
    const token = client.handshake?.auth?.token?.split(' ')[1];

    const authorized = WsAuthGuard.verifyToken(this.jwtService, client, token);

    if (authorized) {
      client.join(client.userId?.toString());
      this.logger.log(`User id:${client.userId} connected`);
    }
  }

  handleDisconnect(client: ISocketWithUserId): void {
    this.logger.log(`User id:${client.userId} disconnected`);
  }

  @SubscribeMessage('events')
  async events(@MessageBody() data: number) {
    console.log('events', data);
  }

  async sendMessage() {
    console.log('Hello from server');
  }
}
