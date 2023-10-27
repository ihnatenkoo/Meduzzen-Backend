export interface ITokens {
  accessToken: string;
  refreshToken: string;
  activateToken: string;
}

export interface ITokenPayload {
  id: number;
  email: string;
}
