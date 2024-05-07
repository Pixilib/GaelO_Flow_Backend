import { Test, TestingModule } from '@nestjs/testing';

import { RolesService } from './roles.service';
import { UsersService } from '../users/users.service';
import { LabelsService } from '../labels/labels.service';

import { RolesController } from './roles.controller';
import { UsersController } from '../users/users.controller';
import { Role } from './role.entity';
import { NotFoundException } from '@nestjs/common';
import { AdminGuard } from '../guards/roles.guard';
import { CheckUserRoleGuard } from '../guards/check-user-role.guard';

describe('RolesController', () => {
  let rolesController: RolesController;
  let rolesService: RolesService;
  let userService: UsersService;
  let labelsService: LabelsService;
  let roleList: Role[];

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
            isRoleExist: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
            addRoleLabel: jest.fn(),
            getRoleLabels: jest.fn(),
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
        ReadAll: true,
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
        ReadAll: true,
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
      const mock = jest
        .spyOn(rolesService, 'findAllWithLabels')
        .mockResolvedValue(roleList);
      const result = await rolesController.findAll({ WithLabels: true });
      expect(result).toEqual(roleList);
      expect(mock).toHaveBeenCalled();
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
        ReadAll: true,
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
          ReadAll: true,
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
        ReadAll: true,
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
          ReadAll: true,
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
          ReadAll: true,
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

      const orGuards = new guards[0]().__getGuards();
      expect(orGuards.length).toBe(2);
      expect(orGuards[0]).toBe(AdminGuard);
      expect(orGuards[1]).toBe(CheckUserRoleGuard);
    });

    it('check if addLabelToRole calls service create', async () => {
      jest
        .spyOn(rolesService, 'findOneByOrFail')
        .mockResolvedValue({ ...roleList[0], Labels: [] });
      jest.spyOn(labelsService, 'isLabelExist').mockResolvedValue(true);
      const mockCreate = jest.spyOn(rolesService, 'addRoleLabel');
      const result = await rolesController.addLabelToRole('User', {
        Name: 'label1',
      });

      expect(result).toBeUndefined();
      expect(mockCreate).toHaveBeenCalled();
    });

    it('check if error is thrown when role does not exist', async () => {
      jest.spyOn(rolesService, 'findOneByOrFail').mockImplementation((name) => {
        throw new NotFoundException('Role not found');
      });
      await expect(
        rolesController.addLabelToRole('NonExistant', { Name: 'label1' }),
      ).rejects.toThrow();
    });

    it('check if error is thrown when label does not exist', async () => {
      jest
        .spyOn(rolesService, 'findOneByOrFail')
        .mockResolvedValue({ ...roleList[0], Labels: [] });
      jest.spyOn(labelsService, 'isLabelExist').mockResolvedValue(false);
      await expect(
        rolesController.addLabelToRole('User', { Name: 'NonExistant' }),
      ).rejects.toThrow();
    });
  });

  describe('getRoleLabels', () => {
    it('check if getRoleLabels has adminGuard and CheckUserRoleGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        RolesController.prototype.getRoleLabels,
      );

      const orGuards = new guards[0]().__getGuards();
      expect(orGuards.length).toBe(2);
      expect(orGuards[0]).toBe(AdminGuard);
      expect(orGuards[1]).toBe(CheckUserRoleGuard);
    });

    it('check if getRoleLabels calls service getRoleLabels', async () => {
      jest
        .spyOn(rolesService, 'getRoleLabels')
        .mockResolvedValue([{ Name: 'label1' }]);
      const result = await rolesController.getRoleLabels('User');
      expect(result).toEqual(['label1']);
    });
  });

  describe('removeLabelFromRole', () => {
    it('check if removeLabelFromRole has adminGuard and CheckUserRoleGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        RolesController.prototype.removeLabelFromRole,
      );

      const orGuards = new guards[0]().__getGuards();
      expect(orGuards.length).toBe(2);
      expect(orGuards[0]).toBe(AdminGuard);
      expect(orGuards[1]).toBe(CheckUserRoleGuard);
    });

    it('check if removeLabelFromRole calls service removeRoleLabel', async () => {
      jest.spyOn(rolesService, 'isRoleExist').mockResolvedValue(true);
      jest.spyOn(labelsService, 'isLabelExist').mockResolvedValue(true);
      jest
        .spyOn(rolesService, 'getRoleLabels')
        .mockResolvedValue([{ Name: 'label1' }]);

      const mockRemove = jest.spyOn(rolesService, 'removeRoleLabel');
      const result = await rolesController.removeLabelFromRole(
        'User',
        'label1',
      );

      expect(result).toBeUndefined();
      expect(mockRemove).toHaveBeenCalled();
    });

    it('check if error is thrown when role does not exist', async () => {
      jest.spyOn(rolesService, 'findOneByOrFail').mockImplementation((name) => {
        throw new NotFoundException('Role not found');
      });

      await expect(
        rolesController.removeLabelFromRole('NonExistant', 'label1'),
      ).rejects.toThrow();
    });

    it('check if error is thrown when label does not exist', async () => {
      jest.spyOn(rolesService, 'findOneByOrFail').mockImplementation((name) => {
        throw new Error('Role not found');
      });

      jest.spyOn(labelsService, 'findOneByOrFail').mockResolvedValue(undefined);
      await expect(
        rolesController.removeLabelFromRole('User', 'NonExistant'),
      ).rejects.toThrow();
    });
  });
});
