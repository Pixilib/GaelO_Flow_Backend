import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesService } from './roles.service';
import { LabelsService } from '../labels/labels.service';

import { Role } from './role.entity';
import { Label } from '../labels/label.entity';

describe('RolesService', () => {
  let rolesService: RolesService;
  let labelService: LabelsService;
  let role: Role;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Role, Label],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Role, Label]),
      ],
      providers: [RolesService, LabelsService],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
    labelService = module.get<LabelsService>(LabelsService);
    role = {
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
    };

    await labelService.create({ Name: 'Label' });

    await rolesService.create(role);
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const result = await rolesService.findAll();
      expect(result).toEqual([role]);
    });
  });

  describe('findAllWithLabels', () => {
    it('should return an array of roles with labels', async () => {
      const result = await rolesService.findAllWithLabels();
      expect(result).toEqual([{ ...role, Labels: [] }]);
    });
  });

  describe('findOneByOrFail', () => {
    it("should return the role name 'User'", async () => {
      const result = await rolesService.findOneByOrFail('User');
      expect(result).toEqual(role);
    });

    it('should throw an error when the role is not found', async () => {
      const nonExistentRole = 'NonExistentRole';
      await expect(
        rolesService.findOneByOrFail(nonExistentRole),
      ).rejects.toThrow();
    });
  });

  describe('isRoleExist', () => {
    it('should return true when the role exists', async () => {
      const result = await rolesService.isRoleExist('User');
      expect(result).toEqual(true);
    });

    it('should return false when the role does not exist', async () => {
      const result = await rolesService.isRoleExist('NonExistentRole');
      expect(result).toEqual(false);
    });
  });

  describe('create', () => {
    it('should create a role', async () => {
      const createRole = {
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
      };
      const createResult = await rolesService.create(createRole);
      const findOneResult = await rolesService.findOneByOrFail('Admin');
      expect(createResult).toBeUndefined();
      expect(findOneResult).toEqual(createRole);
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      const removeResult = await rolesService.remove('User');
      expect(removeResult).toEqual(undefined);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const updateRole = { ...role };
      updateRole.Admin = true;
      const updateResult = await rolesService.update('User', updateRole);
      const findOneResult = await rolesService.findOneByOrFail('User');
      expect(updateResult).toEqual(undefined);
      expect(findOneResult).toEqual(updateRole);
    });
  });

  describe('addRoleLabel', () => {
    it('should add a role label', async () => {
      const addRoleLabelResult = await rolesService.addRoleLabel(
        'User',
        'Label',
      );
      expect(addRoleLabelResult).toEqual(undefined);
    });

    it('should throw an error when the label already exists for the role', async () => {
      await rolesService.addRoleLabel('User', 'Label');
      await expect(
        rolesService.addRoleLabel('User', 'Label'),
      ).rejects.toThrow();
    });
  });

  describe('getRoleLabels', () => {
    it('should get role labels', async () => {
      const getRoleLabelsResult = await rolesService.getRoleLabels('User');
      expect(getRoleLabelsResult).toEqual([]);
    });
  });

  describe('removeRoleLabel', () => {
    it('should remove a role label', async () => {
      const removeRoleLabelResult = await rolesService.removeRoleLabel(
        'User',
        'Label',
      );
      expect(removeRoleLabelResult).toEqual(undefined);
    });
  });
});
