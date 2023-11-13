import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsAuthGuard } from 'src/guards/ws-auth.guard';
import { IMessageToRoom, ISocketWithUserId, SocketEvents } from './types';

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

  async handleConnection(client: ISocketWithUserId): Promise<void> {
    const token = client.handshake?.auth?.token?.split(' ')[1];

    const authorized = WsAuthGuard.verifyToken(this.jwtService, client, token);

    if (authorized) {
      client.join(client.userId.toString());
      this.logger.log(`User id:${client.userId} connected`);
    } else {
      client.disconnect();
    }
  }

  async handleDisconnect(client: ISocketWithUserId): Promise<void> {
    this.logger.log(`User id:${client.userId} disconnected`);
  }

  async sendMessageToRoom({ room, text }: IMessageToRoom): Promise<void> {
    this.server.to(room).emit(SocketEvents.SEND_EVENT, text);
  }
}
