import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';

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
    jest.spyOn(usersService, 'findAll').mockResolvedValue(userList);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await usersController.getUsers()).toEqual(userList);
    });
  });
});
