import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import * as bcryptjs from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';

const VALID_TOKEN = 'valid_token';
const INVALID_TOKEN = 'invalid_token';
const USER_ID = 1;
const USERNAME = 'username';

function createMockUser() {
  const user = new User();
  user.Id = USER_ID;
  user.Username = USERNAME;
  user.Password = 'password';
  user.Role = new Role();
  user.Role.Name = 'User';
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
    it('should return the user when credentials are valid', async () => {
      const user = createMockUser();
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(user);
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(true as never);

      const result = await authService.validateUser(USERNAME, 'password');

      expect(result).toEqual({
        Id: user.Id,
        Username: user.Username,
        Role: user.Role,
      });
    });

    it('should return null when password is invalid', async () => {
      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockResolvedValue(createMockUser());
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(false as never);

      const result = await authService.validateUser(USERNAME, 'invalid');

      expect(result).toBeNull();
    });

    it('should return null when user is not found', async () => {
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(null);

      const result = await authService.validateUser('invalid', 'password');
      expect(result).toBeNull();
    });
  });
  describe('generateHashedToken', () => {
    it('should generate a token and its hash', async () => {
      const { token, hash } = await authService.generateHashedToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token).toHaveLength(64);
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');

      const isMatch = await bcryptjs.compare(token, hash);
      expect(isMatch).toBe(true);
    });
  });
  describe('createConfirmationToken', () => {
    it('should update the user with a hashed token and its expiration, then return the non-hashed token', async () => {
      const mockUser = createMockUser();
      const mockToken = 'randomToken';
      const mockHash = 'hashedRandomToken';

      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(authService, 'generateHashedToken')
        .mockResolvedValue({ token: mockToken, hash: mockHash });
      jest.spyOn(usersService, 'update').mockImplementation();

      const token = await authService.createConfirmationToken(mockUser);

      expect(token).toEqual(mockToken);
      expect(authService.generateHashedToken).toHaveBeenCalled();
      expect(usersService.update).toHaveBeenCalledWith(
        mockUser.Id,
        expect.objectContaining({
          Token: mockHash,
          TokenExpiration: expect.any(Date),
        }),
      );
    });
  });

  describe('isValidChangePasswordToken', () => {
    it('should return true if token matches and is not expired', async () => {
      const mockUser = {
        ...createMockUser(),
        Token: await bcryptjs.hash(VALID_TOKEN, 10),
        TokenExpiration: new Date(Date.now() + 10000),
      };
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(true);

      const result = await authService.isValidChangePasswordToken(
        VALID_TOKEN,
        mockUser,
      );

      expect(result).toBe(true);
    });

    it('should throw BadRequestException if token is expired', async () => {
      const mockUser = {
        ...createMockUser(),
        TokenExpiration: new Date(Date.now() - 10000),
      };

      await expect(
        authService.isValidChangePasswordToken(VALID_TOKEN, mockUser),
      ).toBe(false);
    });

    it('should throw BadRequestException if token does not match', async () => {
      const mockUser = {
        ...createMockUser(),
        TokenExpiration: new Date(Date.now() + 10000),
      };
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(false);

      await expect(
        authService.isValidChangePasswordToken(INVALID_TOKEN, mockUser),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
