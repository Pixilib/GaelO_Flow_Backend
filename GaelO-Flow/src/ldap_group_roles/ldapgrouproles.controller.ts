import { Body, Controller, Get, Post } from '@nestjs/common';
import { LdapGroupRolesService } from './ldapgrouproles.service';

@Controller()
export class LdapGroupRolesController {
  constructor(private readonly LdapGroupRoleService: LdapGroupRolesService) {}
}
