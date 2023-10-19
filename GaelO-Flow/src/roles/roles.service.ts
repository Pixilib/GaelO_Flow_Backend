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

  async findAll(): Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  async findOne(name: string): Promise<Role | null> {
    return await this.rolesRepository.findOneBy({ name });
  }
  
  async create(role: Role): Promise<void> {
    await this.rolesRepository.save(role);
  }

  async remove(name: string): Promise<void> {
    await this.rolesRepository.delete(name);
  }

  async update(name: string, role: Role): Promise<void> {
    await this.rolesRepository.update(name, role);
  }

  public async seed() {
    const admin = this.rolesRepository.create({
      name: 'Admin',
      import: true,
      anonymize: true,
      export: true,
      query: true,
      auto_query: true,
      delete: true,
      admin: true,
      modify: true,
      cd_burner: true,
      auto_routing: true,
    });

    const user = this.rolesRepository.create({
      name: 'User',
      import: true,
      anonymize: true,
      export: true,
      query: true,
      auto_query: true,
      delete: true,
      admin: false,
      modify: true,
      cd_burner: true,
      auto_routing: true,
    });

    await this.rolesRepository.insert([admin, user]);
  }
}
