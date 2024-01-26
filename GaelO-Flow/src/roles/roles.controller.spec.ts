import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './role.entity';

import { UsersService } from '../users/users.service';
import { UsersController } from '../users/users.controller';
import { RoleLabel } from '../role_label/role_label.entity';

describe('RolesController', () => {
  let rolesController: RolesController;
  let rolesService: RolesService;
  let roleList: Role[];
  let roleLabelList: RoleLabel[];

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
            getAllRoleLabels: jest.fn(),
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
      {
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
      },
    ];

    roleLabelList = [
      {
        id: 1,
        role: roleList[0],
        label: { name: 'label1' },
      },
      {
        id: 2,
        role: roleList[0],
        label: { name: 'label2' },
      },
      {
        id: 3,
        role: roleList[1],
        label: { name: 'label3' },
      },
    ];

    rolesController = module.get<RolesController>(RolesController);
    rolesService = module.get<RolesService>(RolesService);
  });

  describe('findAll', () => {
    it('check if findAll has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        RolesController.prototype.findAll,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

    it('check if getRoles calls service findAll', async () => {
      const mock = jest
        .spyOn(rolesService, 'findAll')
        .mockResolvedValue(roleList);
      const result = await rolesController.findAll({ withLabels: false });
      expect(result).toEqual(roleList);
      expect(mock).toHaveBeenCalled();
    });

    it('check if getRoles calls service getAllRoleLabels', async () => {
      const mockFindAll = jest
        .spyOn(rolesService, 'findAll')
        .mockResolvedValue(roleList);

      const mockGetAllRoleLabels = jest
        .spyOn(rolesService, 'getAllRoleLabels')
        .mockResolvedValue(roleLabelList);

      const result = await rolesController.findAll({ withLabels: true });

      expect(result).toEqual(
        roleList.map((role) => {
          return {
            ...role,
            labels: roleLabelList
              .filter((roleLabel) => roleLabel.role.name === role.name)
              .map((roleLabel) => roleLabel.label.name),
          };
        }),
      );
    });
  });

  describe('findOne', () => {
    it('check if findOne has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        RolesController.prototype.findOne,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

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
    it('check if update has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        RolesController.prototype.update,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

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
    it('check if delete has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        RolesController.prototype.delete,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

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
    it('check if createRole has adminGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        RolesController.prototype.CreateRole,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

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

    it('check if error is thrown when role already exists', async () => {
      const mockCreate = jest.spyOn(rolesService, 'create');
      jest.spyOn(rolesService, 'findOne').mockResolvedValue(roleList[0]);
      await expect(
        rolesController.CreateRole({
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
        }),
      ).rejects.toThrow();
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('check if error is thrown when role name is invalid', async () => {
      const mockCreate = jest.spyOn(rolesService, 'create');
      jest.spyOn(rolesService, 'findOne').mockResolvedValue(undefined);
      await expect(
        rolesController.CreateRole({
          name: undefined,
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
        }),
      ).rejects.toThrow();
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });
});
