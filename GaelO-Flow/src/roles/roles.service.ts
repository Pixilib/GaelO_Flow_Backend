import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  findOne(name: string): Promise<Role | null> {
    return this.rolesRepository.findOneBy({ name });
  }

  async remove(name: string): Promise<void> {
    await this.rolesRepository.delete(name);
  }
}