// users.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let usersService: UsersService;
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
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('isRoleUsed', () => {
    it('should return true if role is used', async () => {
      // Arrange
      const roleName = 'Admin';
      const findAndCountMock = jest
        .spyOn(userRepository, 'findAndCount')
        .mockResolvedValue([[], 1]);

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

});
