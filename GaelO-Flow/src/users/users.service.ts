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

  async isRoleUsed(role_name: string): Promise<boolean> {
    const roleCount = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('role.name = :role_name', { role_name: role_name })
      .getCount();
    return roleCount > 0;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
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

    const roleAdmin = new Role();
    roleAdmin.name = 'Admin';

    const admin = this.usersRepository.create({
      username: 'admin',
      firstname: 'Admin',
      lastname: 'Admin',
      email: 'admin@localhost.com',
      password: hashAdmin,
      super_admin: true,
      is_active: true,
      role_name: 'Admin',
      salt: saltAdmin,
    });

    const roleUser = new Role();
    roleUser.name = 'User';

    const user = this.usersRepository.create({
      username: 'user',
      firstname: 'User',
      lastname: 'User',
      email: 'user@localhost.com',
      password: hashUser,
      super_admin: true,
      is_active: true,
      role_name: 'User',
      salt: saltUser,
    });

    await this.usersRepository.insert([admin, user]);
  }
}
