import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LdapGroupRolesService } from './ldapgrouproles.service';

import { RolesGuard } from '../roles/roles.guard';
import { PermissionAdmin } from '../roles/roles.decorator';

@Controller()
@UseGuards(RolesGuard)
export class LdapGroupRolesController {
  constructor(private readonly LdapGroupRoleService: LdapGroupRolesService) {}
}
