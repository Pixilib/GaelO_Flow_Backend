import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcryptjs from 'bcryptjs';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (user && (await bcryptjs.compare(pass, user.Password))) {
      const { Password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user.Id,
      username: user.Username,
      role: user.Role,
      userId: user.Id,
    };
    return {
      AccessToken: await this.jwtService.signAsync(payload),
      UserId: user.Id,
    };
  }

  async createConfirmationToken(user: User): Promise<string> {
    const payload = {
      id: user.Id,
      email: user.Email,
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
