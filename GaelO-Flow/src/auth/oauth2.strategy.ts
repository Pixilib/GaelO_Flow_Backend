import { Strategy } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Oauth2Strategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      authorizationURL:
        'http://localhost:8080/realms/master/protocol/openid-connect/auth',
      tokenURL:
        'http://localhost:8080/realms/master/protocol/openid-connect/token',
      clientID: 'back-end',
      clientSecret: 'XQwqzFUXsfF0zrwn99MDLDQ13r30DLeI',
      callbackURL: 'http://localhost:3000/api/oauth2/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log(accessToken, refreshToken, profile);
    return { accessToken, refreshToken, profile };
  }
}
