import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  HttpException,
  Delete,
  Put,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './role.entity';
import { RoleDto } from './roles.dto';

import { UsersService } from '../users/users.service';

@Controller('/roles')
export class RolesController {
  constructor(
    private readonly RoleService: RolesService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  async findAll(): Promise<Role[]> {
    return this.RoleService.findAll();
  }

  @Get('/:name')
  async findOne(@Param('name') name: string): Promise<Role> {
    const role = await this.RoleService.findOne(name);

    if (!role) throw new HttpException('Role not found', 404);
    return role;
  }

  @Post()
  async CreateRole(@Body() roleDto: RoleDto): Promise<void> {
    const role = new Role();

    if (roleDto.name == undefined)
      throw new HttpException("Missing Primary Key 'name'", 400);

    if ((await this.RoleService.findOne(roleDto.name)) != null)
      throw new HttpException('Role with this name already exists', 409);

    role.name = roleDto.name;
    role.import = roleDto.import;
    role.anonymize = roleDto.anonymize;
    role.export = roleDto.export;
    role.query = roleDto.query;
    role.auto_query = roleDto.auto_query;
    role.delete = roleDto.delete;
    role.admin = roleDto.admin;
    role.modify = roleDto.modify;
    role.cd_burner = roleDto.cd_burner;
    role.auto_routing = roleDto.auto_routing;

    await this.RoleService.create(role);
  }

  @Delete('/:name')
  async delete(@Param('name') name: string): Promise<void> {
    const role = await this.RoleService.findOne(name);

    if (!role) throw new HttpException('Role not found', 404);
    if (await this.userService.isRoleUsed(role.name))
      throw new HttpException('Role is used', 403);

    return this.RoleService.remove(name);
  }

  @Put('/:name')
  async update(
    @Param('name') name: string,
    @Body() roleDto: RoleDto,
  ): Promise<void> {
    const role = await this.RoleService.findOne(name);

    if (!role) throw new HttpException('Role not found', 404);
    if (await this.userService.isRoleUsed(role.name))
      throw new HttpException('Role is used', 403);

    if (roleDto.name != undefined) role.name = roleDto.name;
    if (roleDto.import != undefined) role.import = roleDto.import;
    if (roleDto.anonymize != undefined) role.anonymize = roleDto.anonymize;
    if (roleDto.export != undefined) role.export = roleDto.export;
    if (roleDto.query != undefined) role.query = roleDto.query;
    if (roleDto.auto_query != undefined) role.auto_query = roleDto.auto_query;
    if (roleDto.delete != undefined) role.delete = roleDto.delete;
    if (roleDto.admin != undefined) role.admin = roleDto.admin;
    if (roleDto.modify != undefined) role.modify = roleDto.modify;
    if (roleDto.cd_burner != undefined) role.cd_burner = roleDto.cd_burner;
    if (roleDto.auto_routing != undefined)
      role.auto_routing = roleDto.auto_routing;

    await this.RoleService.update(name, role);
  }
}
