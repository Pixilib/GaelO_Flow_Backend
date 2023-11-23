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

import { AdminGuard } from './roles.guard';

@Controller('/roles')
export class RolesController {
  constructor(
    private readonly RoleService: RolesService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(AdminGuard)
  @Get()
  async findAll(): Promise<Role[]> {
    return this.RoleService.findAll();
  }

  @UseGuards(AdminGuard)
  @Get('/:name')
  @UseInterceptors(NotFoundInterceptor)
  async findOne(@Param('name') name: string): Promise<Role> {
    const role = await this.RoleService.findOne(name);
    return role;
  }

  @UseGuards(AdminGuard)
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

  @UseGuards(AdminGuard)
  @Delete('/:name')
  @UseInterceptors(NotFoundInterceptor)
  async delete(@Param('name') name: string): Promise<void> {
    const role = await this.RoleService.findOne(name);

    if (await this.userService.isRoleUsed(role.name))
      throw new ForbiddenException('Role is used');

    return this.RoleService.remove(name);
  }

  @UseGuards(AdminGuard)
  @Put('/:name')
  @UseInterceptors(NotFoundInterceptor)
  async update(
    @Param('name') name: string,
    @Body() roleDto: RoleDto,
  ): Promise<void> {
    const role = await this.RoleService.findOne(name);

    const requiredKeys = [
      'import',
      'anonymize',
      'export',
      'query',
      'autoQuery',
      'delete',
      'admin',
      'modify',
      'cdBurner',
      'autoRouting',
    ];

    requiredKeys.forEach((key) => {
      if (roleDto[key] === undefined) {
        throw new BadRequestException(`Missing key '${key}' in roleDto`);
      } else {
        role[key] = roleDto[key];
      }
    });

    await this.RoleService.update(name, role);
  }
}
