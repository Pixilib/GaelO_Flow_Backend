import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

interface KeycloakUserInfoResponse {
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
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  async getUserInfoUrl(iss: string): Promise<string> {
    try {
      const wellKnown = await firstValueFrom(
        this.httpService.get(iss + '/.well-known/openid-configuration'),
      );
      return wellKnown.data.userinfo_endpoint;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async verifyToken(token: string): Promise<any> {
    const decoded = await this.jwtService.decode(token);
    const url = await this.getUserInfoUrl(decoded.iss);

    try {
      const response = await firstValueFrom(
        this.httpService.get<KeycloakUserInfoResponse>(url, {
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
      throw new UnauthorizedException();
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
