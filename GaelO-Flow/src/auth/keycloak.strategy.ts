import { Strategy } from 'passport-keycloak-oauth2-oidc';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      realm: 'YOUR_REALM',
      clientID: 'YOUR_CLIENT_ID',
      clientSecret: 'YOUR_CLIENT_SECRET',
      callbackURL: 'YOUR_CALLBACK_URL',
      authorizationURL: 'KEYCLOAK_AUTH_URL',
      tokenURL: 'KEYCLOAK_TOKEN_URL',
      userInfoURL: 'KEYCLOAK_USER_INFO_URL',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);

    // Create / Verify user in db
    return profile;
  }
}
