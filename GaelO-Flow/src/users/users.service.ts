import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, user: User): Promise<void> {
    await this.usersRepository.update(id, user);
  }

  async create(user: User): Promise<number> {
    const newUser = await this.usersRepository.create(user);
    await this.usersRepository.insert([newUser]);
    return newUser.id;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  public async seed() {
    const roleAdmin = new Role()
    roleAdmin.name = 'Admin'
    const admin = this.usersRepository.create({
      username: 'admin',
      firstname: 'Admin',
      lastname: 'Admin',
      email: 'admin@localhost.com',
      password: 'passwordadmin',
      super_admin: true,
      is_active: true,
      role: roleAdmin,
    });

    const roleUser = new Role()
    roleUser.name = 'User'

    const user = this.usersRepository.create({
      username: 'user',
      firstname: 'User',
      lastname: 'User',
      email: 'user@localhost.com',
      password: 'passworduser',
      super_admin: true,
      is_active: true,
      role: roleUser,
    });

    await this.usersRepository.insert([admin, user]);
  }
}