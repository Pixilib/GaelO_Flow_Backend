import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcryptjs from 'bcryptjs';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
}
