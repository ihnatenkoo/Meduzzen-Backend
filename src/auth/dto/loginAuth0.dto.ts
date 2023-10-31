export class LoginAuth0Dto {
  readonly user: {
    email: string;
    avatar: string;
    name: string;
  };
  readonly accessToken: string;
}
