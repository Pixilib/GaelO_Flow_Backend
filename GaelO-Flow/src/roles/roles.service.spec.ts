import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Label } from '../labels/label.entity';
import { RoleLabel } from '../role_label/role-label.entity';
import { LabelsService } from '../labels/labels.service';
import { LabelsModule } from '../labels/labels.module';

describe('RolesService', () => {
  let rolesService: RolesService;
  let role: Role;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Role, Label, RoleLabel],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Role, Label, RoleLabel]),
      ],
      providers: [RolesService, LabelsService],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
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
    };

    await rolesService.create(role);
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const result = await rolesService.findAll();
      expect(result).toEqual([role]);
    });
  });

  describe('findOne', () => {
    it("should return the role name 'User'", async () => {
      const result = await rolesService.findOneByOrFail('User');
      expect(result).toEqual(role);
    });
    it('should throw an error when the role is not found', async () => {
      // Assuming the method throws an error when the role is not found
      const nonExistentRole = 'NonExistentRole';
      await expect(
        rolesService.findOneByOrFail(nonExistentRole),
      ).rejects.toThrow();
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
  });

  describe('getAllRoleLabels', () => {
    it('should get all role labels', async () => {
      const getAllRoleLabelsResult = await rolesService.getAllRoleLabels();
      expect(getAllRoleLabelsResult).toEqual([]);
    });
  });

  describe('getRoleLabels', () => {
    it('should get role labels', async () => {
      const getRoleLabelsResult = await rolesService.getRoleLabels('User');
      expect(getRoleLabelsResult).toEqual([]);
    });
  });
});
