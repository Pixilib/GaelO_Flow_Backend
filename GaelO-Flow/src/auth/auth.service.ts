import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { comparePasswords, generateToken } from '../utils/passwords';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (user && (await comparePasswords(pass, user.Password))) {
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
    const { hash, token: confirmationToken } = await generateToken();
    // const { token: confirmationToken, hash } = await this.generateHashedToken();
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
