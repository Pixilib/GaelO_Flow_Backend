import { Test, TestingModule } from '@nestjs/testing';

import { RolesService } from './roles.service';
import { UsersService } from '../users/users.service';
import { LabelsService } from '../labels/labels.service';

import { RolesController } from './roles.controller';
import { UsersController } from '../users/users.controller';
import { Role } from './role.entity';
import { RoleLabel } from '../role-label/role-label.entity';

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
            findOneByOrFail: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            getAllRoleLabels: jest.fn(),
            isRoleExist: jest.fn(),
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
        {
          provide: LabelsService,
          useValue: {
            findAll: jest.fn(),
            findOneByOrFail: jest.fn(),
            isLabelExist: jest.fn(),
            remove: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    roleList = [
      {
        Name: 'User',
        Import: true,
        Anonymize: true,
        Export: true,
        Query: true,
        AutoQuery: true,
        Delete: true,
        Admin: true,
        Modify: true,
        CdBurner: true,
        AutoRouting: true,
      },
      {
        Name: 'Admin',
        Import: true,
        Anonymize: true,
        Export: true,
        Query: true,
        AutoQuery: true,
        Delete: true,
        Admin: true,
        Modify: true,
        CdBurner: true,
        AutoRouting: true,
      },
    ];

    roleLabelList = [
      {
        Id: 1,
        Role: roleList[0],
        Label: { Name: 'label1' },
      },
      {
        Id: 2,
        Role: roleList[0],
        Label: { Name: 'label2' },
      },
      {
        Id: 3,
        Role: roleList[1],
        Label: { Name: 'label3' },
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
      const result = await rolesController.findAll({ WithLabels: false });
      expect(result).toEqual(roleList);
      expect(mock).toHaveBeenCalled();
    });

    it('check if getRoles calls service getAllRoleLabels', async () => {
      jest.spyOn(rolesService, 'findAll').mockResolvedValue(roleList);

      jest
        .spyOn(rolesService, 'getAllRoleLabels')
        .mockResolvedValue(roleLabelList);

      const result = await rolesController.findAll({ WithLabels: true });

      expect(result).toEqual(
        roleList.map((role) => {
          return {
            ...role,
            labels: roleLabelList
              .filter((roleLabel) => roleLabel.Role.Name === role.Name)
              .map((roleLabel) => roleLabel.Label.Name),
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
        .spyOn(rolesService, 'findOneByOrFail')
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

      jest.spyOn(rolesService, 'findOneByOrFail').mockResolvedValue(roleDto);
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
        .spyOn(rolesService, 'findOneByOrFail')
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
        RolesController.prototype.createRole,
      );
      const guardNames = guards.map((guard: any) => guard.name);

      expect(guardNames.length).toBe(1);
      expect(guardNames).toContain('AdminGuard');
    });

    it('check if createRole calls service create', async () => {
      const mockCreate = jest.spyOn(rolesService, 'create');
      const result = await rolesController.createRole({
        Name: 'Admin',
        Import: true,
        Anonymize: true,
        Export: true,
        Query: true,
        AutoQuery: true,
        Delete: true,
        Admin: true,
        Modify: true,
        CdBurner: true,
        AutoRouting: true,
      });

      expect(result).toBeUndefined();
      expect(mockCreate).toHaveBeenCalled();
    });

    it('check if error is thrown when role already exists', async () => {
      const mockCreate = jest.spyOn(rolesService, 'create');
      jest.spyOn(rolesService, 'isRoleExist').mockResolvedValue(true);
      await expect(
        rolesController.createRole({
          Name: 'User',
          Import: true,
          Anonymize: true,
          Export: true,
          Query: true,
          AutoQuery: true,
          Delete: true,
          Admin: true,
          Modify: true,
          CdBurner: true,
          AutoRouting: true,
        }),
      ).rejects.toThrow();
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('check if error is thrown when role name is invalid', async () => {
      const mockCreate = jest.spyOn(rolesService, 'create');
      jest.spyOn(rolesService, 'findOneByOrFail').mockResolvedValue(undefined);
      await expect(
        rolesController.createRole({
          Name: undefined,
          Import: true,
          Anonymize: true,
          Export: true,
          Query: true,
          AutoQuery: true,
          Delete: true,
          Admin: true,
          Modify: true,
          CdBurner: true,
          AutoRouting: true,
        }),
      ).rejects.toThrow();
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });
});
