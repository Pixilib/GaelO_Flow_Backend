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

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  public async seed() {
    const roleAdmin = new Role()
    roleAdmin.name = 'Admin'
    const admin = this.usersRepository.create({
      userName: 'admin',
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@localhost.com',
      password: 'passwordadmin',
      superAdmin: true,
      isActive: true,
      role: roleAdmin,
    });

    const roleUser = new Role()
    roleUser.name = 'User'

    const user = this.usersRepository.create({
      userName: 'user',
      firstName: 'User',
      lastName: 'User',
      email: 'user@localhost.com',
      password: 'passworduser',
      superAdmin: true,
      isActive: true,
      role: roleUser,
    });

    await this.usersRepository.insert([admin, user]);
  }
}