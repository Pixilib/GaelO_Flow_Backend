import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcryptjs from 'bcryptjs';
import { User } from '../users/user.entity';
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
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (user && (await bcryptjs.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      userId: user.id,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user_id: user.id,
    };
  }

  async createConfirmationToken(user: User): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
    };
    return this.jwtService.signAsync(payload, {
      expiresIn: '24h', // Expiration en 24 heures
    });
  }

  async verifyToken(token: string): Promise<number | null> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded.id;
    } catch (error) {
      return null;
    }
  }

  async verifyKeycloakToken(token: string): Promise<any> {
    const decoded = await this.jwtService.decode(token);
    const url = decoded['iss'] + '/protocol/openid-connect/userinfo';

    try {
      const response = await this.httpService
        .get<KeycloakUserInfoResponse>(url, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .toPromise();

      return {
        username: response.data.preferred_username,
        email: response.data.email,
        firstname: response.data.given_name,
        lastname: response.data.family_name,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }

    return null;
  }
}
