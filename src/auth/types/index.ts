export interface ITokens {
  accessToken: string;
  refreshToken: string;
  activateToken: string;
}

export interface ITokenPayload {
  id: number;
  email: string;
}

export interface ICreateUserResponse {
  message: string;
  userId: number;
}
