// roles.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';

describe('RolesService', () => {
  let rolesService: RolesService;
  let role: Role;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Role],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Role]),
      ],
      providers: [RolesService],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
    role = {
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
      const result = await rolesService.findOne('User');
      expect(result).toEqual(role);
    });
    // TODO: check if throws when role is not found
  });

  describe('create', () => {
    it('should create a role', async () => {
      const createRole = {
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
      };
      const createResult = await rolesService.create(createRole);
      const findOneResult = await rolesService.findOne('Admin');
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
      let updateRole = { ...role };
      updateRole.admin = true;
      const updateResult = await rolesService.update('User', updateRole);
      const findOneResult = await rolesService.findOne('User');
      expect(updateResult).toEqual(undefined);
      expect(findOneResult).toEqual(updateRole);
    });
  });

});
