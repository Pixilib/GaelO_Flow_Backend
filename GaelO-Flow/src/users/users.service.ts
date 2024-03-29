import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcryptjs from 'bcryptjs';

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
    return await this.usersRepository.findOne({
      where: { Email: email },
      relations: {
        Role: withRole,
      },
    });
  }

  async findOneByUsername(
    username: string,
    withRole: boolean = true,
  ): Promise<User> | undefined {
    return await this.usersRepository.findOne({
      where: { Username: username },
      relations: {
        Role: withRole,
      },
    });
  }

  async update(id: number, user: User): Promise<void> {
    await this.usersRepository.update(id, user);
  }

  async create(user: User): Promise<number> {
    const newUser = await this.usersRepository.insert(user);
    return newUser.identifiers[0].Id;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findByUsernameOrEmail(username: string, email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: [{ Username: username }, { Email: email }],
    });
  }

  /* istanbul ignore next */
  public async seed() {
    const saltAdmin = await bcryptjs.genSalt();
    const hashAdmin = await bcryptjs.hash('passwordadmin', saltAdmin);

    const saltUser = await bcryptjs.genSalt();
    const hashUser = await bcryptjs.hash('passworduser', saltUser);

    const admin = this.usersRepository.create({
      Username: 'admin',
      Firstname: 'Admin',
      Lastname: 'Admin',
      Email: 'admin@localhost.com',
      Password: hashAdmin,
      SuperAdmin: true,
      RoleName: 'Admin',
    });

    const user = this.usersRepository.create({
      Username: 'user',
      Firstname: 'User',
      Lastname: 'User',
      Email: 'user@localhost.com',
      Password: hashUser,
      SuperAdmin: true,
      RoleName: 'User',
    });

    await this.usersRepository.insert([admin, user]);
  }
}
