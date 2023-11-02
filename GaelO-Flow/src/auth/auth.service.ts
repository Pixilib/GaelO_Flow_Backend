import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(user: User) {
    const payload = { sub: user.id, username: user.username, role : user.role, userId: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}