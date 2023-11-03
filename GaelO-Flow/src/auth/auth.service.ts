import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

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
}
