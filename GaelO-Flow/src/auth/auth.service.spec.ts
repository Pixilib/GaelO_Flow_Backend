import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import * as passwordUtils from '../utils/passwords';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';

//utils to mock functions in password.ts
jest.mock('../utils/passwords', () => ({
  generateToken: jest
    .fn()
    .mockResolvedValue({ hash: 'hashed_token', token: 'non_hashed_token' }),
  comparePasswords: jest.fn(),
}));
//constants for testing
const VALID_TOKEN = 'valid_token';
const INVALID_TOKEN = 'invalid_token';
const USER_ID = 1;
const USERNAME = 'username';

//mock user function
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

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const userMock = createMockUser();
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(userMock);
      (passwordUtils.comparePasswords as jest.Mock).mockResolvedValue(true);
      const result = await authService.validateUser('validUser', 'password');

      const expectedUser = {
        Id: userMock.Id,
        Username: userMock.Username,
        Role: userMock.Role,
        Firstname: userMock.Firstname,
        Lastname: userMock.Lastname,
        Email: userMock.Email,
        RoleName: userMock.RoleName,
        SuperAdmin: userMock.SuperAdmin,
      };

      expect(result).toEqual(expectedUser);
    });

    it('should return null when password is invalid', async () => {
      const user = createMockUser();
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(user);
      (passwordUtils.comparePasswords as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(USERNAME, 'invalid');

      expect(result).toBeNull();
    });

    it('should return null when user is not found', async () => {
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(null);

      const result = await authService.validateUser('invalid', 'password');
      expect(result).toBeNull();
    });
  });

  describe('createConfirmationToken', () => {
    it('should update the user with a hashed token and its expiration, then return the non-hashed token', async () => {
      const mockUser = createMockUser();
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(usersService, 'update').mockImplementation();

      const token = await authService.createConfirmationToken(mockUser);
      expect(token).toBe('non_hashed_token');
      expect(usersService.update).toHaveBeenCalledWith(
        mockUser.Id,
        expect.objectContaining({
          Token: 'hashed_token',
          TokenExpiration: expect.any(Date),
        }),
      );
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
