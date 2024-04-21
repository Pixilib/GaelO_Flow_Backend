import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import * as passwordUtils from '../utils/passwords';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';

//constants for testing
const VALID_TOKEN = 'valid_token';
const INVALID_TOKEN = 'invalid_token';
const USER_ID = 1;
const USERNAME = 'username';
//mock a user with these function
function createMockUser(): User {
  const user = new User();
  user.Id = USER_ID;
  user.Username = USERNAME;
  user.Password = 'password';
  user.Role = new Role();
  user.Role.Name = 'User';
  user.Firstname = 'John';
  user.Lastname = 'Doe';
  user.Email = 'john.doe@example.com';
  user.SuperAdmin = false;
  user.RoleName = 'User';
  return user;
}

//utils to mock functions in password.ts
jest.mock('../utils/passwords', () => ({
  generateToken: jest
    .fn()
    .mockResolvedValue({ hash: 'hashed_token', token: 'non_hashed_token' }),
  comparePasswords: jest.fn(),
  getTokenExpiration: jest
    .fn()
    .mockReturnValue(new Date(Date.now() + 24 * 60 * 60 * 24)),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    })
      .overrideProvider(UsersService)
      .useValue({
        findOne: jest.fn(),
        findOneByUsername: jest.fn(),
        update: jest.fn(),
      })
      .compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = createMockUser();
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(VALID_TOKEN);

      const result = await authService.login(user);

      expect(result).toEqual({
        AccessToken: VALID_TOKEN,
        UserId: user.Id,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        userId: user.Id,
        sub: user.Id,
        username: user.Username,
        role: { Name: user.Role.Name },
      });
    });
  });

  describe('createConfirmationToken', () => {
    const mockUser = createMockUser();

    beforeEach(() => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(usersService, 'update')
        .mockImplementation(() => Promise.resolve());
    });

    it('should return the non-hashed token', async () => {
      const token = await authService.createConfirmationToken(mockUser);
      expect(token).toBe('non_hashed_token');
    });

    it('should update the user with a hashed token and its expiration', async () => {
      await authService.createConfirmationToken(mockUser);
      expect(usersService.update).toHaveBeenCalledWith(
        mockUser.Id,
        expect.objectContaining({
          Token: 'hashed_token',
          TokenExpiration: passwordUtils.getTokenExpiration(),
        }),
      );
    });

    it('should update the user with a null password', async () => {
      await authService.createConfirmationToken(mockUser);
      const updateCall = (usersService.update as jest.Mock).mock.calls[0][1];
      expect(updateCall.Password).toBeNull();
    });
  });
  //TODO: These tests are failed @AntoninLaudon, Can you fix it?
  //? I don't understand these function !
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
      (passwordUtils.comparePasswords as jest.Mock).mockResolvedValue(
        true as never,
      );

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
      (passwordUtils.comparePasswords as jest.Mock).mockResolvedValue(
        false as never,
      );

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
  describe('verifyConfirmationToken', () => {
    it('should return true if token matches and is not expired', async () => {
      const mockUser = {
        ...createMockUser(),
        Token: 'hashed_valid_token',
        TokenExpiration: new Date(Date.now() + 10000),
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      (passwordUtils.comparePasswords as jest.Mock).mockResolvedValue(true);

      const result = await authService.verifyConfirmationToken(
        VALID_TOKEN,
        mockUser.Id,
      );
      expect(result).toBe(true);
    });

    it('should throw BadRequestException if token is expired', async () => {
      const mockUser = {
        ...createMockUser(),
        TokenExpiration: new Date(Date.now() - 10000),
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);

      await expect(
        authService.verifyConfirmationToken(VALID_TOKEN, mockUser.Id),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if token does not match', async () => {
      const mockUser = {
        ...createMockUser(),
        TokenExpiration: new Date(Date.now() + 10000),
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      (passwordUtils.comparePasswords as jest.Mock).mockResolvedValue(false);
      await expect(
        authService.verifyConfirmationToken(INVALID_TOKEN, mockUser.Id),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
