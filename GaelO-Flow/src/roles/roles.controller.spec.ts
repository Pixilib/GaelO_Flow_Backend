import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './role.entity';

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
        autoQuery: true,
        delete: true,
        admin: false,
        modify: true,
        cdBurner: true,
        autoRouting: true,
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
    it('should successfully update a role with valid input', async () => {
      const roleName = 'ExistingRole';
      const roleDto: any = {
        ...roleList[0],
        import: true,
        anonymize: false,
      };

      jest.spyOn(rolesService, 'findOne').mockResolvedValue(roleDto);
      jest.spyOn(rolesService, 'update').mockResolvedValue(undefined);

      await expect(
        rolesService.update(roleName, roleDto),
      ).resolves.toBeUndefined();

      expect(rolesService.update).toHaveBeenCalledWith(roleName, roleDto);
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
      const mockCreate = jest.spyOn(rolesService, 'create');
      const result = await rolesController.CreateRole({
        name: 'Admin',
        import: true,
        anonymize: true,
        export: true,
        query: true,
        autoQuery: true,
        delete: true,
        admin: true,
        modify: true,
        cdBurner: true,
        autoRouting: true,
      });

      expect(result).toBeUndefined();
      expect(mockCreate).toHaveBeenCalled();
    });
  });
});
