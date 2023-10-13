// users.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { RolesService } from '../roles/roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';

describe('UsersService', () => {
  let usersService: UsersService;
  let rolesService: RolesService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Role],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Role]),
      ],
      providers: [UsersService, RolesService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    rolesService = module.get<RolesService>(RolesService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('isRoleUsed', () => {
    it('should return true if role is used', async () => {
      // Arrange
      const roleName = 'Admin';
      const findAndCountMock = jest
        .spyOn(userRepository, 'findAndCount')
        .mockResolvedValue([[{} as User], 1]);

      // Act
      const result = await usersService.isRoleUsed(roleName);

      // Assert
      expect(findAndCountMock).toHaveBeenCalledWith({
        where: { role_name: roleName },
      });
      expect(result).toBe(true);
    });

    it('should return false if role is not used', async () => {
      // Arrange
      const roleName = 'NonExistentRole';
      const findAndCountMock = jest
        .spyOn(userRepository, 'findAndCount')
        .mockResolvedValue([[], 0]);

      // Act
      const result = await usersService.isRoleUsed(roleName);

      // Assert
      expect(findAndCountMock).toHaveBeenCalledWith({
        where: { role_name: roleName },
      });
      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Arrange
      const findAllMock = jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue([]);

      // Act
      const result = await usersService.findAll();

      // Assert
      expect(findAllMock).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      // Arrange
      const findOneMock = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue({} as User);

      // Act
      const result = await usersService.findOne(1);

      // Assert
      expect(findOneMock).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({});
    });

    it('should return null if user not found', async () => {
      // Arrange
      const findOneMock = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(null);

      // Act
      const result = await usersService.findOne(1);

      // Assert
      expect(findOneMock).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      // Arrange
      const updateMock = jest
        .spyOn(userRepository, 'update')
        .mockResolvedValue(undefined);

      // const role = new Role();
      // role.name = 'User';

      // await rolesService.create(role);
      // await usersService.create({
      //   username: 'testuser',
      //   firstname: 'testfirstname',
      //   lastname: 'testlastname',
      //   email: 'testuser@example.com',
      //   password: 'testpassword',
      //   super_admin: false,
      //   is_active: true,
      //   role_name: role.name,
      //   salt: 'testsalt',
      // });

      // Act
      const result = await usersService.update(1, {} as User);

      // Assert
      expect(updateMock).toHaveBeenCalledWith(1, {} as User);
      expect(userRepository.update).toHaveBeenCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      // Arrange
      const insertMock = jest
        .spyOn(userRepository, 'insert')
        .mockResolvedValue({
          identifiers: [{ id: 1 }],
          generatedMaps: [],
          raw: [],
        } as InsertResult);

      const user = {
        username: 'testuser',
        firstname: 'testfirstname',
        lastname: 'testlastname',
        email: 'testuser@example.com',
        password: '<PASSWORD>',
        super_admin: false,
        is_active: true,
        role_name: 'User',
        salt: 'testsalt',
      };

      // Act
      const result = await usersService.create(user);

      // Assert
      expect(insertMock).toHaveBeenCalledWith(user);
      expect(userRepository.insert).toHaveBeenCalled();
      expect(result).toEqual(1);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      // Arrange
      const deleteMock = jest
        .spyOn(userRepository, 'delete')
        .mockResolvedValue(undefined);

      // Act
      const result = await usersService.remove(1);

      // Assert
      expect(deleteMock).toHaveBeenCalledWith(1);
      expect(userRepository.delete).toHaveBeenCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('findByUsernameOrEmail', () => {
    it('should return a user', async () => {
      // Arrange
      const findOneMock = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue({} as User);

      // Act
      const result = await usersService.findByUsernameOrEmail(
        'testusername',
        'testemail',
      );

      // Assert
      expect(findOneMock).toHaveBeenCalledWith({
        where: [{ username: 'testusername' }, { email: 'testemail' }],
      });
      expect(result).toEqual({});
    });

    it('should return null if user not found', async () => {
      // Arrange
      const findOneMock = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(null);

      // Act
      const result = await usersService.findByUsernameOrEmail(
        'testusername',
        'testemail',
      );

      // Assert
      expect(findOneMock).toHaveBeenCalledWith({
        where: [{ username: 'testusername' }, { email: 'testemail' }],
      });
      expect(result).toEqual(null);
    });
  });
});
