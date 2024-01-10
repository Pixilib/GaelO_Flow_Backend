import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async verifyToken(token: string): Promise<number | null> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded.id;
    } catch (error) {
      return null;
    }
  }
  async signIn(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      userId: user.id,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async createConfirmationToken(user: User): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload, {
      expiresIn: '24h', // Expiration en 24 heures
    });
  }
}
