import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';

import { UsersController } from './users.controller';

import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { AdminGuard } from '../guards/roles.guard';
import { CheckUserIdParamsGuard } from '../guards/check-user-id-params.guard';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let rolesService: RolesService;
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
            findOneByEmail: jest.fn(),
            isExistingUser: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {
            isRoleExist: jest.fn(),
            findOneByOrFail: jest.fn(),
          },
        },
      ],
    }).compile();

    userList = [
      {
        Firstname: 'firstname',
        Lastname: 'lastname',
        Password: 'password',
        Email: 'email',
        RoleName: 'roleName',
        Role: new Role(),
      },
    ];
    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    rolesService = module.get<RolesService>(RolesService);
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
      const mockResult: GetUserDto[] = userList.map((user) => ({
        Id: user.Id,
        Firstname: user.Firstname,
        Lastname: user.Lastname,
        Email: user.Email,
        RoleName: user.RoleName,
        Role: user.Role,
      }));
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

      const orGuards = new guards[0]().__getGuards();
      expect(orGuards.length).toBe(2);
      expect(orGuards[0]).toBe(AdminGuard);
      expect(orGuards[1]).toBe(CheckUserIdParamsGuard);
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

      const orGuards = new guards[0]().__getGuards();
      expect(orGuards.length).toBe(2);
      expect(orGuards[0]).toBe(AdminGuard);
      expect(orGuards[1]).toBe(CheckUserIdParamsGuard);
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

    it('check if update throws error if user does not exist', async () => {
      const mockFindOne = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(undefined);
      await expect(
        usersController.update(1, {
          Firstname: 'firstname',
        } as UpdateUserDto),
      ).rejects.toThrow();
      expect(mockFindOne).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('check if delete has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        UsersController.prototype.delete,
      );

      const orGuards = new guards[0]().__getGuards();
      expect(orGuards.length).toBe(2);
      expect(orGuards[0]).toBe(AdminGuard);
      expect(orGuards[1]).toBe(CheckUserIdParamsGuard);
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

    it('check if delete throws error if user does not exist', async () => {
      const mockIsExistingUser = jest
        .spyOn(usersService, 'isExistingUser')
        .mockResolvedValue(false);
      await expect(usersController.delete(1)).rejects.toThrow();
      expect(mockIsExistingUser).toHaveBeenCalled();
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
      const mockCreate = jest.spyOn(usersService, 'create').mockResolvedValue({
        ...userList[0],
        Id: 1,
      });
      jest.spyOn(rolesService, 'isRoleExist').mockResolvedValue(true);
      const result = await usersController.createUser({
        Firstname: 'firstname',
        Lastname: 'lastname',
        Password: 'Password123!',
        Email: 'email@email.com',
        RoleName: 'roleName',
      });

      expect(typeof result).toBe('number');
      expect(mockCreate).toHaveBeenCalled();
    });

    it('check if createUser throws error if role does not exist', async () => {
      const mockIsRoleExist = jest
        .spyOn(rolesService, 'isRoleExist')
        .mockResolvedValue(false);

      await expect(
        usersController.createUser({
          Firstname: 'firstname',
          Lastname: 'lastname',
          Password: 'Password123!',
          Email: 'email@email.com',
          RoleName: 'roleName',
        }),
      ).rejects.toThrow();

      expect(mockIsRoleExist).toHaveBeenCalled();
    });

    it('check if createUser throws error if user already exists', async () => {
      const mockIsRoleExist = jest
        .spyOn(rolesService, 'isRoleExist')
        .mockResolvedValue(true);
      const mockIsExistingUser = jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(userList[0]);

      await expect(
        usersController.createUser({
          Firstname: 'firstname',
          Lastname: 'lastname',
          Password: 'Password123!',
          Email: 'email@email.com',
          RoleName: 'roleName',
        }),
      ).rejects.toThrow();

      expect(mockIsRoleExist).toHaveBeenCalled();
      expect(mockIsExistingUser).toHaveBeenCalled();
    });
  });
});
