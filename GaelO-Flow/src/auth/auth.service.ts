import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import {
  comparePasswords,
  generateToken,
  getTokenExpiration,
} from '../utils/passwords';

/**
 * Database access for users
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await comparePasswords(pass, user.Password))) {
      delete user.Password;
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user.Id,
      email: user.Email,
      role: user.Role,
      userId: user.Id,
    };
    return {
      AccessToken: await this.jwtService.signAsync(payload),
      UserId: user.Id,
    };
  }

  async createConfirmationToken(user: User): Promise<string> {
    const { hash, token: confirmationToken } = await generateToken();
    user.Token = hash;
    user.TokenExpiration = getTokenExpiration();
    user.Password = null;
    await this.usersService.update(user.Id, user);
    return confirmationToken;
  }

  async verifyConfirmationToken(
    token: string,
    userId: number,
  ): Promise<boolean> {
    const user = await this.usersService.findOne(userId);

    if (new Date() > user.TokenExpiration) {
      throw new BadRequestException('Token expired');
    }
    const isMatch = await comparePasswords(token, user.Token);
    if (!isMatch) {
      throw new BadRequestException('Invalid token');
    }
    return true;
  }
}
