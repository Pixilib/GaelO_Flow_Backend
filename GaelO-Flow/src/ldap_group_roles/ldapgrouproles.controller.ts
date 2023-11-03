import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LdapGroupRolesService } from './ldapgrouproles.service';

import { RolesGuard } from 'src/roles/roles.guard';
import { PermissionAdmin } from 'src/roles/roles.decorator';

@Controller()
@UseGuards(RolesGuard)
export class LdapGroupRolesController {
  constructor(private readonly LdapGroupRoleService: LdapGroupRolesService) {}
}
