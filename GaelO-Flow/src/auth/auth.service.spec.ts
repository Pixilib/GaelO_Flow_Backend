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

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule, ConfigModule],
      providers: [
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

  it('should return an access token', async () => {
    const mock = jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

    const user = new User();
    user.id = 1;
    user.username = 'username';
    user.role = new Role();
    user.role.name = 'User';

    const result = await authService.signIn(user);

    expect(result).toStrictEqual({
      access_token: 'token',
    });
  });

  it('should return the decoded id when the token is valid', async () => {
    // Arrange
    const token = 'valid_token';
    const decoded = { id: 123 };

    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(decoded);

    // Act
    const result = await authService.verifyToken(token);

    // Assert
    expect(result).toBe(decoded.id);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
  });

  it('should return null when the token is invalid', async () => {
    // Arrange
    const token = 'invalid_token';

    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockRejectedValue(new Error('Invalid token'));

    // Act
    const result = await authService.verifyToken(token);

    // Assert
    expect(result).toBeNull();
    expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
  });
});
