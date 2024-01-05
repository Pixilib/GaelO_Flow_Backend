import { Controller } from '@nestjs/common';
import { LdapGroupRolesService } from './ldapgrouproles.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ldapgrouproles')
@Controller()
export class LdapGroupRolesController {
  constructor(private readonly LdapGroupRoleService: LdapGroupRolesService) {}
}
