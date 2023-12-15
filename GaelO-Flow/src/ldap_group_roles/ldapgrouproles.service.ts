import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LdapGroupRole } from './ldapgrouprole.entity';

@Injectable()
export class LdapGroupRolesService {
  constructor(
    @InjectRepository(LdapGroupRole)
    private ldapgrouprolesRepository: Repository<LdapGroupRole>,
  ) {}

  findAll(): Promise<LdapGroupRole[]> {
    return this.ldapgrouprolesRepository.find();
  }

  findOne(id: number): Promise<LdapGroupRole | null> {
    return this.ldapgrouprolesRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.ldapgrouprolesRepository.delete(id);
  }
}
