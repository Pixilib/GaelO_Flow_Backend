import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const findUserId = await this.usersService.findOne(user.Id);
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcryptjs.hash(confirmationToken, Number(bcryptjs));
    const expireToken = new Date(Date.now() + 24 * 60 * 60 * 1000);
    console.log({ findUserId, confirmationToken, hash, expireToken });
    const updatedUser: User = {
      ...findUserId,
      Token: hash,
      TokenExpiration: expireToken,
      Password: null,
    };
    await this.usersService.update(user.Id, updatedUser);
    return confirmationToken;
  }

  async verifyConfirmationToken(
    token: string,
    userId: number,
  ): Promise<boolean> {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (new Date() > user.TokenExpiration) {
        throw new BadRequestException('Token expired');
      }

      const isMatch = await bcryptjs.compare(token, user.Token);
      if (!isMatch) {
        throw new BadRequestException('Invalid token');
      }

      return true;
    } catch (error) {
      console.log({ error });
      return false;
    }
  }
}
