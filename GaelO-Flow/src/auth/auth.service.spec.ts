import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcryptjs from 'bcryptjs';
import { HttpModule } from '@nestjs/axios';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule, ConfigModule, HttpModule],
      providers: [
        UsersService,
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        MailService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const mock = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue('token');

      const user = new User();
      user.Id = 1;
      user.Username = 'username';
      user.Role = new Role();
      user.Role.Name = 'User';

      const result = await authService.login(user);

      expect(result).toStrictEqual({
        AccessToken: 'token',
        UserId: user.Id,
      });
      expect(mock).toHaveBeenCalledWith({
        userId: user.Id,
        sub: user.Id,
        username: user.Username,
        role: user.Role,
      });
    });
  });

  describe('validateUser', () => {
    it('should return the user when the credentials are valid', async () => {
      const user = new User();
      user.Id = 1;
      user.Username = 'username';
      user.Password = 'password';
      user.Role = new Role();
      user.Role.Name = 'User';

      jest
        .spyOn(UsersService.prototype, 'findOneByUsername')
        .mockResolvedValue(user);
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(true as never);

      const result = await authService.validateUser('username', 'password');

      expect(result).toStrictEqual({
        Id: user.Id,
        Username: user.Username,
        Role: user.Role,
      });
    });

    it('should return null when the password is invalid', async () => {
      const user = new User();
      user.Password = 'password';

      jest
        .spyOn(UsersService.prototype, 'findOneByUsername')
        .mockResolvedValue(user);
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(false as never);

      const result = await authService.validateUser('username', 'invalid');

      expect(result).toBeNull();
    });

    it('should return null when the user is invalid', async () => {
      jest
        .spyOn(UsersService.prototype, 'findOneByUsername')
        .mockResolvedValue(undefined);

      const result = await authService.validateUser('invalid', 'password');

      expect(result).toBeNull();
    });
  });

  describe('createConfirmationToken', () => {
    it('should return a confirmation token', async () => {
      const user = new User();
      user.Id = 1;
      user.Username = 'username';
      user.Email = 'email';

      const mock = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue('token');

      const result = await authService.createConfirmationToken(user);

      expect(result).toBe('token');
      expect(mock).toHaveBeenCalledWith(
        {
          id: user.Id,
          email: user.Email,
        },
        { expiresIn: '24h' },
      );
    });
  });

  describe('verifyToken', () => {
    it('should return the id when the token is valid', async () => {
      const payload = { id: 1, email: 'email' };
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);

      const result = await authService.verifyToken('token');

      expect(result).toBe(1);
    });

    it('should throw an error when the token is invalid', async () => {
      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error());

      expect(await authService.verifyToken('invalid')).toBeNull();
    });
  });
});
