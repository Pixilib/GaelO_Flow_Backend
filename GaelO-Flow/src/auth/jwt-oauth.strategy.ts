import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtOauthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: string): Promise<any> {
    const userData = await this.authService.verifyKeycloakToken(token);
    if (!userData || !userData.email) {
      throw new UnauthorizedException('Invalid token');
    }
    return userData;
  }
}
