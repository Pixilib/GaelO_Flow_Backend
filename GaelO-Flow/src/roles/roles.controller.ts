import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Put,
  UseInterceptors,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './role.entity';
import { RoleDto } from './roles.dto';

import { UsersService } from '../users/users.service';
import { NotFoundInterceptor } from '../interceptors/NotFoundInterceptor';

import { RolesGuard } from '../roles/roles.guard';
import { PermissionAdmin } from '../roles/roles.decorator';

@Controller('/roles')
@UseGuards(RolesGuard)
export class RolesController {
  constructor(
    private readonly RoleService: RolesService,
    private readonly userService: UsersService,
  ) {}

  @PermissionAdmin()
  @Get()
  async findAll(): Promise<Role[]> {
    return this.RoleService.findAll();
  }

  @PermissionAdmin()
  @Get('/:name')
  @UseInterceptors(NotFoundInterceptor)
  async findOne(@Param('name') name: string): Promise<Role> {
    const role = await this.RoleService.findOne(name);
    return role;
  }

  @PermissionAdmin()
  @Post()
  async CreateRole(@Body() roleDto: RoleDto): Promise<void> {
    const role = new Role();

    if (roleDto.name == undefined)
      throw new BadRequestException("Missing Primary Key 'name'");

    if ((await this.RoleService.findOne(roleDto.name)) != null)
      throw new ConflictException('Role with this name already exists');

    role.name = roleDto.name;
    role.import = roleDto.import;
    role.anonymize = roleDto.anonymize;
    role.export = roleDto.export;
    role.query = roleDto.query;
    role.autoQuery = roleDto.autoQuery;
    role.delete = roleDto.delete;
    role.admin = roleDto.admin;
    role.modify = roleDto.modify;
    role.cdBurner = roleDto.cdBurner;
    role.autoRouting = roleDto.autoRouting;

    await this.RoleService.create(role);
  }

  @PermissionAdmin()
  @Delete('/:name')
  @UseInterceptors(NotFoundInterceptor)
  async delete(@Param('name') name: string): Promise<void> {
    const role = await this.RoleService.findOne(name);

    if (await this.userService.isRoleUsed(role.name))
      throw new ForbiddenException('Role is used');

    return this.RoleService.remove(name);
  }

  @PermissionAdmin()
  @Put('/:name')
  @UseInterceptors(NotFoundInterceptor)
  async update(
    @Param('name') name: string,
    @Body() roleDto: RoleDto,
  ): Promise<void> {
    const role = await this.RoleService.findOne(name);

    // TODO: remove all checks, json needs to be fully populated
    if (roleDto.import != undefined) role.import = roleDto.import;
    if (roleDto.anonymize != undefined) role.anonymize = roleDto.anonymize;
    if (roleDto.export != undefined) role.export = roleDto.export;
    if (roleDto.query != undefined) role.query = roleDto.query;
    if (roleDto.autoQuery != undefined) role.autoQuery = roleDto.autoQuery;
    if (roleDto.delete != undefined) role.delete = roleDto.delete;
    if (roleDto.admin != undefined) role.admin = roleDto.admin;
    if (roleDto.modify != undefined) role.modify = roleDto.modify;
    if (roleDto.cdBurner != undefined) role.cdBurner = roleDto.cdBurner;
    if (roleDto.autoRouting != undefined)
      role.autoRouting = roleDto.autoRouting;

    await this.RoleService.update(name, role);
  }
}
