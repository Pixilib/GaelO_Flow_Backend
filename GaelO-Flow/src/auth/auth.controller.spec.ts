import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

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
            verifyConfirmationToken: jest.fn(),
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
            findOneByEmail: jest.fn(),
            updateUserPassword: jest.fn(),
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
          Email: 'email',
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
    it('check if signUp is public', async () => {
      const isPublic = Reflect.getMetadata(
        'isPublic',
        AuthController.prototype.register,
      );
      expect(isPublic).toBe(true);
    });
    it('should throw ConflictException if user exists', async () => {
      const registerDto = new RegisterDto();
      registerDto.Email = 'existing@example.com';

      const mockUser = {
        Id: 1,
        Email: 'existingg@person.com',
      } as User;
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);

      await expect(authController.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
    it('should register user and send confirmation email if user does not exist', async () => {
      const registerDto = new RegisterDto();
      registerDto.Email = 'new@example.com';
      registerDto.Firstname = 'John';
      registerDto.Lastname = 'Doe';

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockImplementation(() =>
        Promise.resolve({
          Id: 1,
          Email: 'new@example.com',
          Firstname: 'John',
          Lastname: 'Doe',
          Password: null,
          RoleName: 'User',
        }),
      );
      jest
        .spyOn(authService, 'createConfirmationToken')
        .mockResolvedValue('confirmationToken');
      jest
        .spyOn(mailService, 'sendChangePasswordEmail')
        .mockImplementation(() => Promise.resolve());

      await authController.register(registerDto);

      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          Email: 'new@example.com',
          Firstname: 'John',
          Lastname: 'Doe',
          Password: null,
        }),
      );
      expect(authService.createConfirmationToken).toHaveBeenCalled();
      expect(mailService.sendChangePasswordEmail).toHaveBeenCalledWith(
        'new@example.com',
        'confirmationToken',
        1,
      );
    });

    it('should throw a ConflictException if user already exists', async () => {
      const registerDto = {
        Email: 'test@example2.com',
        Firstname: 'John2',
        Lastname: 'Doe2',
      };

      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValueOnce(new User());

      await expect(authController.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('lostPassword', () => {
    it('check if lostPassword is in public', async () => {
      const isPublic = Reflect.getMetadata(
        'isPublic',
        AuthController.prototype.lostPassword,
      );

      expect(isPublic).toBe(true);
    });
    it('should send an email with a password reset link', async () => {
      const email = 'hola@mail.com';
      const user = {
        Id: 1,
        Email: email,
      };

      usersService.findOneByEmail = jest.fn().mockResolvedValue(user);
      authService.createConfirmationToken = jest
        .fn()
        .mockResolvedValue('token');
      mailService.sendChangePasswordEmail = jest
        .fn()
        .mockResolvedValue(undefined);
    });
    it('should throw an error if user is not found', async () => {
      usersService.findOneByEmail = jest.fn().mockResolvedValue(undefined);
    });
  });
  describe('changePassword', () => {
    it('check if changePassword is in public', async () => {
      const isPublic = Reflect.getMetadata(
        'isPublic',
        AuthController.prototype.changePassword,
      );

      expect(isPublic).toBe(true);
    });
    it('should throw a BadRequestException if passwords do not match', async () => {
      const dto = {
        Token: 'token',
        NewPassword: 'password1',
        ConfirmationPassword: 'password2',
        UserId: 1,
      };

      await expect(authController.changePassword(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a Not found Exception if user is not found', async () => {
      const dto = {
        Token: 'token',
        NewPassword: 'password',
        ConfirmationPassword: 'password',
        UserId: 1,
      };

      jest
        .spyOn(usersService, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(authController.changePassword(dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update user password if token is valid and passwords match', async () => {
      const dto = {
        Token: 'token',
        NewPassword: 'password',
        ConfirmationPassword: 'password',
        UserId: 1,
      };

      const user = {
        Id: 1,
        Firstname: 'John',
        Lastname: 'Doe',
        Username: 'johndoe',
        Password: 'password',
        Email: 'johndoe@mail.com',
        SuperAdmin: false,
        RoleName: 'User',
        Token: 'token',
        TokenExpiration: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(user);
      jest
        .spyOn(authService, 'verifyConfirmationToken')
        .mockResolvedValueOnce(true);
      jest
        .spyOn(usersService, 'updateUserPassword')
        .mockResolvedValueOnce(undefined);

      await authController.changePassword(dto);

      expect(usersService.findOne).toHaveBeenCalledWith(dto.UserId);
      expect(authService.verifyConfirmationToken).toHaveBeenCalledWith(
        dto.Token,
        user.Id,
      );
      expect(usersService.updateUserPassword).toHaveBeenCalledWith(
        user.Id,
        dto.NewPassword,
      );
    });
  });
});
