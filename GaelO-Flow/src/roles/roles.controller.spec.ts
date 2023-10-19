import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './role.entity';
import { RoleDto } from './roles.dto';

import { UsersService } from '../users/users.service';
import { UsersController } from '../users/users.controller';

describe('RolesController', () => {
  let rolesController: RolesController;
  let rolesService: RolesService;
  let roleList: Role[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController, UsersController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
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
          },
        },
      ],
    }).compile();

    roleList = [
      {
        name: 'User',
        import: true,
        anonymize: true,
        export: true,
        query: true,
        auto_query: true,
        delete: true,
        admin: false,
        modify: true,
        cd_burner: true,
        auto_routing: true,
      },
    ];
    rolesController = module.get<RolesController>(RolesController);
    rolesService = module.get<RolesService>(RolesService);
  });

  describe('findAll', () => {
    it('check if getRoles calls service findAll', async () => {
      const mock = jest
        .spyOn(rolesService, 'findAll')
        .mockResolvedValue(roleList);
      const result = await rolesController.findAll();
      expect(result).toEqual(roleList);
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('check if findOne calls service findOne', async () => {
      const mock = jest
        .spyOn(rolesService, 'findOne')
        .mockResolvedValue(roleList[0]);
      const result = await rolesController.findOne('User');
      expect(result).toEqual(roleList[0]);
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('check if update calls service update', async () => {
      const mockFindOne = jest
        .spyOn(rolesService, 'findOne')
        .mockResolvedValue(roleList[0]);
      const mockUpdate = jest.spyOn(rolesService, 'update');
      const result = await rolesController.update('User', {
        name: 'newRolename',
      } as RoleDto);
      expect(result).toBeUndefined();
      expect(mockFindOne).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('check if delete calls service remove', async () => {
      const mockFindOne = jest
        .spyOn(rolesService, 'findOne')
        .mockResolvedValue(roleList[0]);
      const mockRemove = jest.spyOn(rolesService, 'remove');
      const result = await rolesController.delete('User');
      expect(result).toBeUndefined();
      expect(mockFindOne).toHaveBeenCalled();
      expect(mockRemove).toHaveBeenCalled();
    });
  });

  describe('createRole', () => {
    it('check if createRole calls service create', async () => {
      const mockCreate = jest
        .spyOn(rolesService, 'create')
      const result = await rolesController.CreateRole({
        name: 'Admin',
        import: true,
        anonymize: true,
        export: true,
        query: true,
        auto_query: true,
        delete: true,
        admin: true,
        modify: true,
        cd_burner: true,
        auto_routing: true,
      });

      expect(result).toBeUndefined();
      expect(mockCreate).toHaveBeenCalled();
    });
  });
});
