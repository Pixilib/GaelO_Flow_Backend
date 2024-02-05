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

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule, ConfigModule],
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
      user.id = 1;
      user.username = 'username';
      user.role = new Role();
      user.role.name = 'User';

      const result = await authService.login(user);

      expect(result).toStrictEqual({
        access_token: 'token',
      });
      expect(mock).toHaveBeenCalledWith({
        userId: user.id,
        sub: user.id,
        username: user.username,
        role: user.role,
      });
    });
  });

  describe('validateUser', () => {
    it('should return the user when the credentials are valid', async () => {
      const user = new User();
      user.id = 1;
      user.username = 'username';
      user.password = 'password';
      user.role = new Role();
      user.role.name = 'User';

      jest
        .spyOn(UsersService.prototype, 'findOneByUsername')
        .mockResolvedValue(user);
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(true as never);

      const result = await authService.validateUser('username', 'password');

      expect(result).toStrictEqual({
        id: user.id,
        username: user.username,
        role: user.role,
      });
    });

    it('should return null when the password is invalid', async () => {
      const user = new User();
      user.password = 'password';

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
      user.id = 1;
      user.username = 'username';
      user.email = 'email';

      const mock = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue('token');

      const result = await authService.createConfirmationToken(user);

      expect(result).toBe('token');
      expect(mock).toHaveBeenCalledWith(
        {
          id: user.id,
          email: user.email,
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
