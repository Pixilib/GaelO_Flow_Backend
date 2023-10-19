import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LdapGroupRolesService } from './ldapgrouproles.service';
import { LdapGroupRolesController } from './ldapgrouproles.controller';
import { LdapGroupRole } from './ldapgrouprole.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LdapGroupRole])],
  providers: [LdapGroupRolesService],
  controllers: [LdapGroupRolesController],
})
export class UsersModule {}
