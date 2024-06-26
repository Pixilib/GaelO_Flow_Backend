import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersModule } from './users.module';

import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';
import { LabelsService } from '../labels/labels.service';

import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { Label } from '../labels/label.entity';
import { hashPassword } from '../utils/passwords';

jest.mock('../utils/passwords', () => ({
  hashPassword: jest.fn(),
}));

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
          entities: [User, Role, Label],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Role, Label]),
      ],
      providers: [UsersService, RolesService, LabelsService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    rolesService = module.get<RolesService>(RolesService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    let hash: string;
    const userRole = new Role();
    userRole.Name = 'User';

    const adminRole = new Role();
    adminRole.Name = 'Admin';

    hash = 'first';
    firstUser = {
      Firstname: 'first_firstname',
      Lastname: 'first_lastname',
      Email: 'first@example.com',
      Password: hash,
      RoleName: userRole.Name,
      Token: null,
      TokenExpiration: null,
      Role: userRole,
    };

    hash = 'second';
    secondUser = {
      Firstname: 'second_firstname',
      Lastname: 'second_lastname',
      Email: 'second@example.com',
      Password: hash,
      RoleName: userRole.Name,
      Token: null,
      TokenExpiration: null,
      Role: userRole,
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
      const role = await rolesService.findOneByOrFail('User');
      const result = await usersService.findAll();
      expect(result).toEqual([
        { ...firstUser, Role: role },
        { ...secondUser, Role: role },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return the first user', async () => {
      const role = await rolesService.findOneByOrFail('User');
      const result = await usersService.findOne(1);
      expect(result).toEqual({ ...firstUser, Role: role });
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
      const role = await rolesService.findOneByOrFail('User');
      const user = { ...firstUser };
      user.Firstname = 'updateTest';
      const updateResult = await usersService.update(1, user);
      const findOneResult = await usersService.findOne(1);
      expect(updateResult).toEqual(undefined);
      expect(findOneResult).toEqual({ ...user, Role: role });
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUser = {
        Firstname: 'create_testfirstname',
        Lastname: 'create_testlastname',
        Email: 'create_testuser@example.com',
        Password: 'create_<PASSWORD>',
        RoleName: 'User',
        Token: null,
        TokenExpiration: null,
      };
      const createResult = await usersService.create(createUser);
      const findOneResult = await usersService.findOne(createResult.Id);
      expect(createResult).toBeInstanceOf(Object);
      expect(findOneResult).toEqual({
        Email: 'create_testuser@example.com',
        Firstname: 'create_testfirstname',
        Id: 3,
        Lastname: 'create_testlastname',
        Password: 'create_<PASSWORD>',
        Role: {
          Admin: false,
          Anonymize: false,
          AutoQuery: false,
          AutoRouting: false,
          CdBurner: false,
          Delete: false,
          Export: false,
          Import: false,
          Modify: false,
          Name: 'User',
          Query: false,
          ReadAll: false,
        } as Role,
        Token: null,
        TokenExpiration: null,
        RoleName: 'User',
      });
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

  describe('findOneByEmail', () => {
    it('should return a user', async () => {
      const result = await usersService.findOneByEmail('first@example.com');
      expect(result).toEqual(firstUser);
    });

    it('should return null if user not found', async () => {
      const result = await usersService.findOneByEmail('no@example.com');
      expect(result).toBeNull();
    });
  });

  describe('updateUserPassword', () => {
    it('should update the user password', async () => {
      const id = 1;
      const newPassword = 'new_password';
      const hashedPassword = 'hashed_password';
      const findUser = {
        ...firstUser,
        Password: 'old_password',
      };
      const userWithPasswordUpdated = {
        ...findUser,
        Password: hashedPassword,
      };

      (hashPassword as jest.Mock).mockResolvedValue(hashedPassword as never);
      jest.spyOn(usersService, 'findOne').mockResolvedValue(findUser);
      jest.spyOn(usersService, 'update').mockResolvedValue(undefined);

      await usersService.updateUserPassword(id, newPassword);

      expect(hashPassword).toHaveBeenCalledWith(newPassword);
      expect(usersService.findOne).toHaveBeenCalledWith(id);
      expect(usersService.update).toHaveBeenCalledWith(
        id,
        userWithPasswordUpdated,
      );
    });
  });
});
