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
  
  create(role: Role): Promise<Role> {
    return this.rolesRepository.save(role);
  }

  async remove(name: string): Promise<void> {
    await this.rolesRepository.delete(name);
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
