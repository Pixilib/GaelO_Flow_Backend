import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { hashPassword } from '../utils/passwords';
/**
 * Database access to user related data.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async isRoleUsed(roleName: string): Promise<boolean> {
    const roleCount = await this.usersRepository.findAndCount({
      where: {
        RoleName: roleName,
      },
    });
    return roleCount[1] > 0;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      relations: { Role: true },
    });
  }

  async findOne(id: number, withRole: boolean = true): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { Id: id },
      relations: {
        Role: withRole,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async isExistingUser(id: number): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { Id: id },
    });
    return user ? true : false;
  }

  async findOneByEmail(
    email: string,
    withRole: boolean = true,
  ): Promise<User> | undefined {
    if (email === undefined) return undefined;
    const user = await this.usersRepository.findOne({
      where: { Email: email },
      relations: {
        Role: withRole,
      },
    });
    return user;
  }

  async update(id: number, user: User): Promise<void> {
    await this.usersRepository.update(id, user);
  }

  async updateUserPassword(id: number, newPassword: string): Promise<void> {
    const hashedPassword = await hashPassword(newPassword);
    const findUser = await this.findOne(id);
    const userWithPasswordUpdated = { ...findUser, Password: hashedPassword };
    await this.update(id, userWithPasswordUpdated);
  }

  async create(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  /* istanbul ignore next */
  public async seed() {
    const hashAdmin = await hashPassword('passwordadmin');

    const hashUser = await hashPassword('passworduser');

    const admin = this.usersRepository.create({
      Firstname: 'Admin',
      Lastname: 'Admin',
      Email: 'admin@gaelo.com',
      Password: hashAdmin,
      RoleName: 'Admin',
    });

    const user = this.usersRepository.create({
      Firstname: 'User',
      Lastname: 'User',
      Email: 'user@gaelo.com',
      Password: hashUser,
      RoleName: 'User',
    });

    await this.usersRepository.insert([admin, user]);
  }
}
