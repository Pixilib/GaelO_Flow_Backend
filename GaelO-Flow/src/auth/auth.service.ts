import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';
import * as bcryptjs from 'bcryptjs';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (user && (await bcryptjs.compare(password, user.Password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { Password: _, ...result } = user;
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
  async generateHashedToken(): Promise<{
    token: string;
    hash: string;
  }> {
    const token = crypto.randomBytes(32).toString('hex');
    const hash = await bcryptjs.hash(token, 10);
    return { token, hash };
  }

  async createConfirmationToken(user: User): Promise<string> {
    const findUserId = await this.usersService.findOne(user.Id);
    const { token: confirmationToken, hash } = await this.generateHashedToken();
    const expireToken = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const updatedUser: User = {
      ...findUserId,
      Token: hash,
      TokenExpiration: expireToken,
      Password: null,
    };
    await this.usersService.update(user.Id, updatedUser);
    return confirmationToken;
  }

  async isValidChangePasswordToken(
    token: string,
    user: User,
  ): Promise<boolean> {
    const tokenValid = await bcryptjs.compare(token, user.Token);
    if (tokenValid && new Date() < user.TokenExpiration) {
      return true;
    }
    return false;
  }
}
