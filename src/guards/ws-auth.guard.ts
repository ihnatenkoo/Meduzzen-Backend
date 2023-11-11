import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from 'src/auth/types';
import { ISocketWithUserId } from 'src/events/types';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client: ISocketWithUserId = context.switchToWs().getClient();
    const auth = client.handshake?.auth;
    const token = auth.token?.split(' ')[1];

    return WsAuthGuard.verifyToken(this.jwtService, client, token);
  }

  static verifyToken(
    jwtService: JwtService,
    client: ISocketWithUserId,
    token: string,
  ): boolean {
    try {
      const { id } = jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      }) as ITokenPayload;

      client.userId = id;

      return true;
    } catch (error) {
      return false;
    }
  }
}
