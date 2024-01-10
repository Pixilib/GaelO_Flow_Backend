import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';
import * as bcryptjs from 'bcryptjs';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            isRoleUsed: jest.fn(),
            findOneByUsername: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('signIn', () => {
    it('check if signIn is public', async () => {
      const isPublic = Reflect.getMetadata(
        'isPublic',
        AuthController.prototype.signIn,
      );

      expect(isPublic).toBe(true);
    });

    it('should return an access token', async () => {
      jest.spyOn(authService, 'signIn').mockReturnValue(
        Promise.resolve({
          access_token: 'token',
        }),
      );
      jest.spyOn(usersService, 'findOneByUsername').mockReturnValue(
        Promise.resolve({
          id: 1,
          username: 'username',
          role: {
            name: 'User',
          },
        } as User),
      );
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(true as never);

      const result = await authController.signIn({});

      expect(result).toStrictEqual({
        access_token: 'token',
      });
    });

    it('should throw an UnauthorizedException if user does not exist', async () => {
      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockReturnValue(Promise.resolve(undefined));

      await expect(authController.signIn({})).rejects.toThrow('Unauthorized');
    });

    it('should throw an UnauthorizedException if password is incorrect', async () => {
      jest.spyOn(usersService, 'findOneByUsername').mockReturnValue(
        Promise.resolve({
          id: 1,
          username: 'username',
          role: {
            name: 'User',
          },
        } as User),
      );
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(false as never);

      await expect(authController.signIn({})).rejects.toThrow('Unauthorized');
    });
  });

  // TODO: add tests for register when it is implemented
});
