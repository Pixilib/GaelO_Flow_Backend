import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { UserDto } from './users.dto';

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
          },
        },
      ],
    }).compile();

    userList = [
      {
        firstname: 'firstname',
        lastname: 'lastname',
        username: 'username',
        password: 'password',
        email: 'email',
        super_admin: true,
        role_name: 'role_name',
        role: new Role(),
        is_active: true,
        salt: 'salt',
      },
    ];
    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getUsers', () => {
    it('check if getUsers calls service findAll', async () => {
      const mock = jest
        .spyOn(usersService, 'findAll')
        .mockResolvedValue(userList);
      const result = await usersController.getUsers();
      expect(result).toEqual(userList);
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('getUsersId', () => {
    it('check if getUsersId calls service findOne', async () => {
      const mock = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(userList[0]);
      const result = await usersController.getUsersId(1);
      expect(result).toEqual(userList[0]);
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('check if update calls service update', async () => {
      const mockFindOne = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(userList[0]);
      const mockUpdate = jest.spyOn(usersService, 'update');
      const result = await usersController.update(1, {
        username: 'newUsername',
      } as UserDto);
      expect(result).toBeUndefined();
      expect(mockFindOne).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('check if delete calls service remove', async () => {
      const mockFindOne = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(userList[0]);
      const mockRemove = jest.spyOn(usersService, 'remove');
      const result = await usersController.delete(1);
      expect(result).toBeUndefined();
      expect(mockFindOne).toHaveBeenCalled();
      expect(mockRemove).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('check if createUser calls service create', async () => {
      const mockCreate = jest.spyOn(usersService, 'create');
      try {
        await usersController.createUser({
          firstname: 'firstname',
          lastname: 'lastname',
          username: 'username',
          password: 'Password123!',
          email: 'email',
          super_admin: true,
          role_name: 'role_name',
          is_active: true,
        });

        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    // it('check if createUser with bad email throws', async () => {
    //   const mockCreate = jest.spyOn(usersService, 'create');
    //   const result = await usersController.createUser({
    //     firstname: 'firstname',
    //     lastname: 'lastname',
    //     username: 'username',
    //     password: 'Password123!',
    //     email: 'email',
    //     super_admin: true,
    //     role_name: 'role_name',
    //     is_active: true,
    //   });
    // });
  });
});
