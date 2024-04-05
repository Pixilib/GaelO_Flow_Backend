import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { GetUserDto, UpdateUserDto } from './users.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let userList: User[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            findByUsernameOrEmail: jest.fn(),
            isExistingUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userList = [
      {
        Firstname: 'firstname',
        Lastname: 'lastname',
        Username: 'username',
        Password: 'password',
        Email: 'email',
        SuperAdmin: true,
        RoleName: 'roleName',
        Role: new Role(),
      },
    ];
    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getUsers', () => {
    it('check if getUsers has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        UsersController.prototype.getUsers,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

    it('check if getUsers calls service findAll', async () => {
      const mockResult: GetUserDto[] = userList;
      const mock = jest
        .spyOn(usersService, 'findAll')
        .mockResolvedValue(userList);
      const result = await usersController.getUsers();
      expect(result).toEqual(mockResult);
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('getUsersId', () => {
    it('check if getUsersId has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        UsersController.prototype.getUsersId,
      );
      const guardNames = guards[0].guards.map(
        (guard: any) => guard.constructor.name,
      );
      expect(guards.length).toBe(1);
      expect(guards[0].constructor.name).toBe('OrGuard');
      expect(guardNames.length).toBe(2);
      expect(guardNames).toContain('AdminGuard');
      expect(guardNames).toContain('CheckUserIdGuard');
    });

    it('check if getUsersId calls service findOne', async () => {
      const mock = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(userList[0]);
      const result = await usersController.getUsersId(1);
      expect(result).toEqual({
        ...userList[0],
        Password: undefined,
        Salt: undefined,
      });
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('check if update has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        UsersController.prototype.update,
      );
      const guardNames = guards[0].guards.map(
        (guard: any) => guard.constructor.name,
      );
      expect(guards.length).toBe(1);
      expect(guards[0].constructor.name).toBe('OrGuard');
      expect(guardNames.length).toBe(2);
      expect(guardNames).toContain('AdminGuard');
      expect(guardNames).toContain('CheckUserIdGuard');
    });

    it('check if update calls service update', async () => {
      const mockFindOne = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(userList[0]);
      const mockUpdate = jest.spyOn(usersService, 'update');
      const result = await usersController.update(1, {
        Firstname: 'firstname',
      } as UpdateUserDto);
      expect(result).toBeUndefined();
      expect(mockFindOne).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('check if delete has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        UsersController.prototype.delete,
      );
      const guardNames = guards[0].guards.map(
        (guard: any) => guard.constructor.name,
      );
      expect(guards.length).toBe(1);
      expect(guards[0].constructor.name).toBe('OrGuard');
      expect(guardNames.length).toBe(2);
      expect(guardNames).toContain('AdminGuard');
      expect(guardNames).toContain('CheckUserIdGuard');
    });

    it('check if delete calls service remove', async () => {
      const mockIsExistingUser = jest
        .spyOn(usersService, 'isExistingUser')
        .mockResolvedValue(true);
      const mockRemove = jest.spyOn(usersService, 'remove');
      const result = await usersController.delete(1);
      expect(result).toBeUndefined();
      expect(mockIsExistingUser).toHaveBeenCalled();
      expect(mockRemove).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('check if createUser has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        UsersController.prototype.createUser,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

    it('check if createUser calls service create', async () => {
      const mockCreate = jest
        .spyOn(usersService, 'create')
        .mockResolvedValue(1);
      const result = await usersController.createUser({
        Firstname: 'firstname',
        Lastname: 'lastname',
        Username: 'username',
        Password: 'Password123!',
        Email: 'email@email.com',
        SuperAdmin: true,
        RoleName: 'roleName',
      });

      expect(typeof result).toBe('number');
      expect(mockCreate).toHaveBeenCalled();
    });

    it('check if createUser throws with bad email', async () => {
      const mockCreate = jest.spyOn(usersService, 'create');
      try {
        await usersController.createUser({
          Firstname: 'firstname',
          Lastname: 'lastname',
          Username: 'username',
          Password: 'Password123!',
          Email: 'email',
          SuperAdmin: true,
          RoleName: 'roleName',
        });
        expect(mockCreate).toHaveBeenCalledTimes(1);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('check if createUser throws with bad password', async () => {
      const mockCreate = jest.spyOn(usersService, 'create');
      try {
        await usersController.createUser({
          Firstname: 'firstname',
          Lastname: 'lastname',
          Username: 'username',
          Password: 'very_secured',
          Email: 'email@email.com',
          SuperAdmin: true,
          RoleName: 'roleName',
        });
        expect(mockCreate).toHaveBeenCalledTimes(1);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
