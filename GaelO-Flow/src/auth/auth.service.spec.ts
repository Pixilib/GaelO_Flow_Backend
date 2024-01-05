import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should return an access token', async () => {
      const mock = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue('token');

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
  });

  // TODO: add tests for register when the it is implemented
});
