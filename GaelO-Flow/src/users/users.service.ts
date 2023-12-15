import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async isRoleUsed(roleName: string): Promise<boolean> {
    const roleCount = await this.usersRepository.findAndCount({
      where: {
        roleName: roleName,
      },
    });
    return roleCount[1] > 0;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOneByOrFail({ id });
  }

  async isExistingUser(id: number): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user ? true : false;
  }

  async findOneByEmail(
    email: string,
    withRole: boolean,
  ): Promise<User> | undefined {
    return await this.usersRepository.findOne({
      where: { email: email },
      relations: {
        role: withRole,
      },
    });
  }

  async findOneByUsername(
    username: string,
    withRole: boolean,
  ): Promise<User> | undefined {
    return await this.usersRepository.findOne({
      where: { username: username },
      relations: {
        role: withRole,
      },
    });
  }

  async update(id: number, user: User): Promise<void> {
    await this.usersRepository.update(id, user);
  }

  async create(user: User): Promise<number> {
    const newUser = await this.usersRepository.insert(user);
    return newUser.identifiers[0].id;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findByUsernameOrEmail(username: string, email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });
  }

  public async seed() {
    const saltAdmin = await bcrypt.genSalt();
    const hashAdmin = await bcrypt.hash('passwordadmin', saltAdmin);

    const saltUser = await bcrypt.genSalt();
    const hashUser = await bcrypt.hash('passworduser', saltUser);

    const admin = this.usersRepository.create({
      username: 'admin',
      firstname: 'Admin',
      lastname: 'Admin',
      email: 'admin@localhost.com',
      password: hashAdmin,
      superAdmin: true,
      isActive: true,
      roleName: 'Admin',
      salt: saltAdmin,
    });

    const user = this.usersRepository.create({
      username: 'user',
      firstname: 'User',
      lastname: 'User',
      email: 'user@localhost.com',
      password: hashUser,
      superAdmin: true,
      isActive: true,
      roleName: 'User',
      salt: saltUser,
    });

    await this.usersRepository.insert([admin, user]);
  }
}
