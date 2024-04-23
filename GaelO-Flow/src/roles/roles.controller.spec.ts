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
  let userService: UsersService;
  let labelsService: LabelsService;
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
            findAllWithLabels: jest.fn(),
            findOneByOrFail: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            getAllRoleLabels: jest.fn(),
            isRoleExist: jest.fn(),
            getRoleLabels: jest.fn(),
            addRoleLabel: jest.fn(),
            removeRoleLabel: jest.fn(),
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
    userService = module.get<UsersService>(UsersService);
    labelsService = module.get<LabelsService>(LabelsService);
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
      const roleListWithLabels = roleList.map((role) => ({
        ...role,
        labels: roleLabelList
          .filter((roleLabel) => roleLabel.Role.Name === role.Name)
          .map((roleLabel) => roleLabel.Label.Name),
      }));

      jest
        .spyOn(rolesService, 'findAllWithLabels')
        .mockResolvedValue(roleListWithLabels);

      jest
        .spyOn(rolesService, 'getAllRoleLabels')
        .mockResolvedValue(roleLabelList);

      const result = await rolesController.findAll({ WithLabels: true });

      expect(result).toEqual(roleListWithLabels);
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
      const mockUpdate = jest.spyOn(rolesService, 'update');
      const result = await rolesController.update('User', {
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
      });

      expect(result).toBeUndefined();
      expect(mockUpdate).toHaveBeenCalled();
    });

    it('should throw an error when role does not exist', async () => {
      jest.spyOn(rolesService, 'isRoleExist').mockResolvedValue(false);
      await expect(
        rolesController.update('NonExistant', {
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

    it('check if error is thrown when role is used', async () => {
      jest
        .spyOn(rolesService, 'findOneByOrFail')
        .mockResolvedValue(roleList[0]);
      jest.spyOn(userService, 'isRoleUsed').mockResolvedValue(true);
      await expect(rolesController.delete('User')).rejects.toThrow();
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

  describe('addLabelToRole', () => {
    it('check if addLabelToRole has adminGuard and CheckUserRoleGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        RolesController.prototype.addLabelToRole,
      );
      const guardNames = guards[0].guards.map(
        (guard: any) => guard.constructor.name,
      );

      expect(guards.length).toBe(1);
      expect(guards[0].constructor.name).toBe('OrGuard');
      expect(guardNames.length).toBe(2);
      expect(guardNames).toContain('AdminGuard');
      expect(guardNames).toContain('CheckUserRoleGuard');
    });

    it('check if addLabelToRole calls service create', async () => {
      jest.spyOn(rolesService, 'isRoleExist').mockResolvedValue(true);
      jest.spyOn(labelsService, 'isLabelExist').mockResolvedValue(true);
      jest.spyOn(rolesService, 'getRoleLabels').mockResolvedValue([]);
      const mockCreate = jest.spyOn(rolesService, 'addRoleLabel');
      const result = await rolesController.addLabelToRole('User', {
        label: 'label1',
      });

      expect(result).toBeUndefined();
      expect(mockCreate).toHaveBeenCalled();
    });

    it('check if error is thrown when role does not exist', async () => {
      jest.spyOn(rolesService, 'isRoleExist').mockResolvedValue(false);
      await expect(
        rolesController.addLabelToRole('NonExistant', { label: 'label1' }),
      ).rejects.toThrow();
    });

    it('check if error is thrown when label does not exist', async () => {
      jest.spyOn(rolesService, 'isRoleExist').mockResolvedValue(true);
      jest.spyOn(labelsService, 'isLabelExist').mockResolvedValue(false);
      await expect(
        rolesController.addLabelToRole('User', { label: 'NonExistant' }),
      ).rejects.toThrow();
    });

    it('check if error is thrown when label already exists for role', async () => {
      jest
        .spyOn(labelsService, 'findOneByOrFail')
        .mockResolvedValue({ Name: 'label1' });
      jest.spyOn(rolesService, 'getRoleLabels').mockResolvedValue([
        {
          Id: 1,
          Label: { Name: 'label1' },
          Role: { Name: 'User' } as Role,
        },
      ]);
      await expect(
        rolesController.addLabelToRole('User', { label: 'label1' }),
      ).rejects.toThrow();
    });
  });

  describe('getRoleLabels', () => {
    it('check if getRoleLabels has adminGuard and CheckUserRoleGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        RolesController.prototype.getRoleLabels,
      );
      const guardNames = guards[0].guards.map(
        (guard: any) => guard.constructor.name,
      );

      expect(guards.length).toBe(1);
      expect(guards[0].constructor.name).toBe('OrGuard');
      expect(guardNames.length).toBe(2);
      expect(guardNames).toContain('AdminGuard');
      expect(guardNames).toContain('CheckUserRoleGuard');
    });

    it('check if getRoleLabels calls service getRoleLabels', async () => {
      const mockGetRoleLabels = jest
        .spyOn(rolesService, 'getRoleLabels')
        .mockResolvedValue(roleLabelList);
      const result = await rolesController.getRoleLabels('User');

      expect(result).toEqual(
        roleLabelList.map((roleLabel) => roleLabel.Label.Name),
      );
      expect(mockGetRoleLabels).toHaveBeenCalled();
    });
  });

  describe('removeLabelFromRole', () => {
    it('check if removeLabelFromRole has adminGuard and CheckUserRoleGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        RolesController.prototype.removeLabelFromRole,
      );
      const guardNames = guards[0].guards.map(
        (guard: any) => guard.constructor.name,
      );

      expect(guards.length).toBe(1);
      expect(guards[0].constructor.name).toBe('OrGuard');
      expect(guardNames.length).toBe(2);
      expect(guardNames).toContain('AdminGuard');
      expect(guardNames).toContain('CheckUserRoleGuard');
    });

    it('check if removeLabelFromRole calls service removeRoleLabel', async () => {
      jest.spyOn(rolesService, 'isRoleExist').mockResolvedValue(true);
      jest.spyOn(labelsService, 'isLabelExist').mockResolvedValue(true);
      jest.spyOn(rolesService, 'getRoleLabels').mockResolvedValue([
        {
          Id: 1,
          Label: { Name: 'label1' },
          Role: { Name: 'User' } as Role,
        },
      ]);
      const mockRemove = jest.spyOn(rolesService, 'removeRoleLabel');
      const result = await rolesController.removeLabelFromRole(
        'User',
        'label1',
      );

      expect(result).toBeUndefined();
      expect(mockRemove).toHaveBeenCalled();
    });

    it('check if error is thrown when role does not exist', async () => {
      jest.spyOn(rolesService, 'isRoleExist').mockResolvedValue(false);
      await expect(
        rolesController.removeLabelFromRole('NonExistant', 'label1'),
      ).rejects.toThrow();
    });

    it('check if error is thrown when label does not exist', async () => {
      jest.spyOn(rolesService, 'isRoleExist').mockResolvedValue(true);
      jest.spyOn(labelsService, 'isLabelExist').mockResolvedValue(false);
      await expect(
        rolesController.removeLabelFromRole('User', 'NonExistant'),
      ).rejects.toThrow();
    });

    it('check if error is thrown when label does not exist for role', async () => {
      jest.spyOn(rolesService, 'getRoleLabels').mockResolvedValue([
        {
          Id: 1,
          Label: { Name: 'label1' },
          Role: { Name: 'User' } as Role,
        },
      ]);
      await expect(
        rolesController.removeLabelFromRole('User', 'label2'),
      ).rejects.toThrow();
    });
  });
});
