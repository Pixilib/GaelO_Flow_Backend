import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule, ConfigModule],
      controllers: [AuthController],
      providers: [
        MailService,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            validateUser: jest.fn(),
            createConfirmationToken: jest.fn(),
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
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendChangePasswordEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    mailService = module.get<MailService>(MailService);
  });

  describe('login', () => {
    it('check if signIn is public', async () => {
      const isPublic = Reflect.getMetadata(
        'isPublic',
        AuthController.prototype.login,
      );

      expect(isPublic).toBe(true);
    });

    it('should return an access token', async () => {
      jest.spyOn(authService, 'login').mockReturnValue(
        Promise.resolve({
          AccessToken: 'token',
          UserId: 1,
        }),
      );
      jest.spyOn(authService, 'validateUser').mockReturnValue(
        Promise.resolve({
          Id: 1,
          Username: 'username',
          Role: {
            Name: 'User',
          },
        } as User),
      );

      const result = await authController.login({
        user: {
          username: 'username',
          password: 'password',
        },
      } as any);

      expect(result).toStrictEqual({
        AccessToken: 'token',
        UserId: 1,
      });
    });
  });

  describe('register', () => {
    it('check if signIn is public', async () => {
      const isPublic = Reflect.getMetadata(
        'isPublic',
        AuthController.prototype.register,
      );

      expect(isPublic).toBe(true);
    });

    it('should create a new user and send confirmation email', async () => {
      const registerDto = {
        Email: 'test@example.com',
        Firstname: 'John',
        Lastname: 'Doe',
        Username: 'johndoe',
      };

      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValueOnce(undefined);
      jest.spyOn(usersService, 'create').mockResolvedValueOnce(1);

      const mockUser = {
        Firstname: registerDto.Firstname,
        Lastname: registerDto.Lastname,
        Username: registerDto.Username,
        Email: registerDto.Email,
        SuperAdmin: false,
        RoleName: 'User',
        Password: null,
      };

      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValueOnce(mockUser);

      jest
        .spyOn(authService, 'createConfirmationToken')
        .mockResolvedValueOnce('confirmation_token');
      jest
        .spyOn(mailService, 'sendChangePasswordEmail')
        .mockResolvedValue(null);

      const result = await authController.register(registerDto);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        registerDto.Email,
        false,
      );
      expect(usersService.create).toHaveBeenCalledWith(mockUser);
      expect(authService.createConfirmationToken).toHaveBeenCalledWith(
        mockUser,
      );
    });

    it('should throw a ConflictException if user already exists', async () => {
      const registerDto = {
        Email: 'test@example.com',
        Firstname: 'John',
        Lastname: 'Doe',
        Username: 'johndoe',
      };

      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValueOnce({} as User);

      await expect(authController.register(registerDto)).rejects.toThrow(
        'A user already exist with this username or email',
      );
    });
  });

  describe('changePassword', () => {
    it('should change the password', async () => {
      const mockUser = {
        Id: 1,
        Username: 'username',
        Role: {
          Name: 'User',
        },
      };
      const mockReq = {
        user: {
          userId: 1,
        },
      };
      const changePasswordDto = {
        NewPassword: 'Password123!',
        ConfirmationPassword: 'Password123!',
      };

      jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValueOnce(mockUser as User);
      jest.spyOn(usersService, 'update').mockResolvedValueOnce(null);

      await authController.changePassword(changePasswordDto, mockReq as any);
      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(usersService.update).toHaveBeenCalledWith(1, mockUser);
    });

    it('should throw a BadRequestException if passwords do not match', async () => {
      const mockUser = {
        Id: 1,
        Username: 'username',
        Role: {
          Name: 'User',
        },
      };
      const mockReq = {
        user: {
          userId: 1,
        },
      };
      const changePasswordDto = {
        NewPassword: 'Password123!',
        ConfirmationPassword: 'Password1234!',
      };

      jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValueOnce(mockUser as User);
      jest.spyOn(usersService, 'update').mockResolvedValueOnce(null);

      await expect(
        authController.changePassword(changePasswordDto, mockReq as any),
      ).rejects.toThrow('Confirmation password not matching');
    });
  });
});
