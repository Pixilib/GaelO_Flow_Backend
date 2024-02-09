// users.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { RolesService } from '../roles/roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { RoleLabel } from '../role_label/role_label.entity';
import { LabelsService } from '../labels/labels.service';
import { Label } from '../labels/label.entity';
import { UsersModule } from './users.module';

describe('UsersService', () => {
  let usersService: UsersService;
  let rolesService: RolesService;
  let userRepository: Repository<User>;
  let firstUser: User;
  let secondUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Role, Label, RoleLabel],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Role, Label, RoleLabel]),
      ],
      providers: [UsersService, RolesService, LabelsService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    rolesService = module.get<RolesService>(RolesService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    let salt: string;
    let hash: string;
    const userRole = new Role();
    userRole.name = 'User';

    const adminRole = new Role();
    adminRole.name = 'Admin';

    salt = await bcryptjs.genSalt();
    hash = await bcryptjs.hash('first', salt);
    firstUser = {
      username: 'first_username',
      firstname: 'first_firstname',
      lastname: 'first_lastname',
      email: 'first@example.com',
      password: hash,
      superAdmin: false,
      roleName: userRole.name,
    };

    salt = await bcryptjs.genSalt();
    hash = await bcryptjs.hash('second', salt);
    secondUser = {
      username: 'second_username',
      firstname: 'second_firstname',
      lastname: 'second_lastname',
      email: 'second@example.com',
      password: hash,
      superAdmin: false,
      roleName: userRole.name,
    };

    await rolesService.create(userRole);
    await rolesService.create(adminRole);
    await usersService.create(firstUser);
    await usersService.create(secondUser);
  });

  describe('isRoleUsed', () => {
    it('should return true if role is used', async () => {
      const roleName = 'User';
      const result = await usersService.isRoleUsed(roleName);
      expect(result).toBe(true);
    });

    it('should return false if role is not used', async () => {
      const roleName = 'Admin';
      const result = await usersService.isRoleUsed(roleName);
      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const role = await rolesService.findOne('User');
      const result = await usersService.findAll();
      expect(result).toEqual([
        { ...firstUser, role },
        { ...secondUser, role },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return the first user', async () => {
      const role = await rolesService.findOne('User');
      const result = await usersService.findOne(1);
      expect(result).toEqual({ ...firstUser, role });
    });
  });

  describe('isExistingUser', () => {
    it('should return true if user exists', async () => {
      const result = await usersService.isExistingUser(1);
      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      const result = await usersService.isExistingUser(3);
      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const role = await rolesService.findOne('User');
      const user = { ...firstUser };
      user.firstname = 'updateTest';
      const updateResult = await usersService.update(1, user);
      const findOneResult = await usersService.findOne(1);
      expect(updateResult).toEqual(undefined);
      expect(findOneResult).toEqual({ ...user, role });
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const role = await rolesService.findOne('User');
      const createUser = {
        username: 'create_testuser',
        firstname: 'create_testfirstname',
        lastname: 'create_testlastname',
        email: 'create_testuser@example.com',
        password: 'create_<PASSWORD>',
        superAdmin: false,
        roleName: 'User',
      };
      const createResult = await usersService.create(createUser);
      const findOneResult = await usersService.findOne(createResult);
      expect(typeof createResult).toBe('number');
      expect(createResult).toBeGreaterThan(0);
      expect(findOneResult).toEqual({ ...createUser, role });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const spyOnUserRepositoryDelete = jest.spyOn(userRepository, 'delete');
      const removeResult = await usersService.remove(1);
      expect(removeResult).toEqual(undefined);
      expect(spyOnUserRepositoryDelete).toHaveBeenCalled();
    });
  });

  describe('findByUsernameOrEmail', () => {
    it('should return a user', async () => {
      const result = await usersService.findByUsernameOrEmail(
        'first_username',
        'first@example.com',
      );
      expect(result).toEqual(firstUser);
    });

    it('should return null if user not found', async () => {
      const result = await usersService.findByUsernameOrEmail(
        'no_username',
        'no@example.com',
      );
      expect(result).toBeNull();
    });
  });
});
