import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import * as bcryptjs from 'bcryptjs';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';

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
            signIn: jest.fn(),
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
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValueOnce(undefined);
      jest.spyOn(usersService, 'create').mockResolvedValueOnce(1);

      const mockUser = { 
        ...registerDto, 
        email: registerDto.email,
        superAdmin: false,
        roleName: 'User',
        password: null,
        salt: null 
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValueOnce(mockUser);

      jest.spyOn(authService, 'createConfirmationToken').mockResolvedValueOnce('confirmation_token');
      jest.spyOn(mailService, 'sendChangePasswordEmail').mockResolvedValue(null);

      const result = await authController.register(registerDto);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(registerDto.email, false);
      expect(usersService.create).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        status: HttpStatus.CREATED,
        message: 'An email has been sent, confirm your account to login',
      });
    });

  });
});