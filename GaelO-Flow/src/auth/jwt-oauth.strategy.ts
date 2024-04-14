import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { OauthConfigService } from '../oauth-configs/oauth-configs.service';

interface UserInfoResponse {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

@Injectable()
export class JwtOauthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly oauthConfigService: OauthConfigService,
  ) {
    super();
  }

  async getWellKnown(iss: string): Promise<object> {
    try {
      const wellKnown = await firstValueFrom(
        this.httpService.get(iss + '/.well-known/openid-configuration'),
      );
      return wellKnown.data;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateIssuer(wellKnown: object): Promise<boolean> {
    const authorizationUrl = wellKnown['authorization_endpoint'];
    const config =
      await this.oauthConfigService.findOneByAuthorizationUrl(authorizationUrl);
    return !!config;
  }

  async getUserInfoUrl(wellKnown: object): Promise<string> {
    return wellKnown['userinfo_endpoint'];
  }

  async verifyToken(token: string): Promise<any> {
    const decoded = await this.jwtService.decode(token);
    const wellKnown = await this.getWellKnown(decoded.iss);
    const url = await this.getUserInfoUrl(wellKnown);

    if (!(await this.validateIssuer(wellKnown))) {
      throw new UnauthorizedException('Unknown issuer');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<UserInfoResponse>(url, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );
      return {
        username: response.data.preferred_username,
        email: response.data.email,
        firstname: response.data.given_name,
        lastname: response.data.family_name,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validate(token: string): Promise<any> {
    const userData = await this.verifyToken(token);
    if (!userData || !userData.email) {
      throw new UnauthorizedException('Invalid token');
    }
    return userData;
  }
}
