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
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrGuard } from '../utils/orGuards';
import { RequestCheckValues } from '../utils/RequestCompareGuard';
import { RoleLabel } from '../role_label/role_label.entity';
import { Label } from 'src/labels/label.entity';

@ApiTags('roles')
@Controller('/roles')
export class RolesController {
  constructor(
    private readonly roleService: RolesService,
    private readonly userService: UsersService,
  ) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get all roles', type: [Role] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get()
  async findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get role by name', type: Role })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get('/:name')
  @UseInterceptors(NotFoundInterceptor)
  async findOne(@Param('name') name: string): Promise<Role> {
    console.log('name', name);
    const role = await this.roleService.findOne(name);
    return role;
  }

  // @Get('/:roleName/labels')
  // check if user has role 'name'

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'Create role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @ApiBody({ type: RoleDto })
  @Post()
  async CreateRole(@Body() roleDto: RoleDto): Promise<void> {
    const role = new Role();

    if (roleDto.name == undefined)
      throw new BadRequestException("Missing Primary Key 'name'");

    if ((await this.roleService.findOne(roleDto.name)) != null)
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

    await this.roleService.create(role);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Delete role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Delete('/:name')
  @UseInterceptors(NotFoundInterceptor)
  async delete(@Param('name') name: string): Promise<void> {
    const role = await this.roleService.findOne(name);

    if (await this.userService.isRoleUsed(role.name))
      throw new ForbiddenException('Role is used');

    return this.roleService.remove(name);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Update role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Put('/:name')
  @UseInterceptors(NotFoundInterceptor)
  async update(
    @Param('name') name: string,
    @Body() roleDto: RoleDto,
  ): Promise<void> {
    const role = await this.roleService.findOne(name);

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

    await this.roleService.update(name, role);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Add label to role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(
    new OrGuard([
      new AdminGuard(),
      new RequestCheckValues(['params', 'roleName'], ['user', 'role', 'name']),
    ]),
  )
  @Post('/:roleName/label')
  @ApiBody({ schema: { example: { label: 'label' } } })
  async addLabelToRole(
    @Param('roleName') roleName: string,
    @Body() labelDto: { label: string },
  ): Promise<void> {
    await this.roleService.addRoleLabel(roleName, labelDto.label);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get all labels from role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(
    new OrGuard([
      new AdminGuard(),
      new RequestCheckValues(['params', 'roleName'], ['user', 'role', 'name']),
    ]),
  )
  @Get('/:roleName/labels')
  async getRoleLabels(@Param('roleName') roleName: string): Promise<String[]> {
    const allRoleLabels = await this.roleService.getRoleLabels(roleName);
    const labels = allRoleLabels.map((roleLabel) => roleLabel.label.name);
    return labels;
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Remove label from role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(
    new OrGuard([
      new AdminGuard(),
      new RequestCheckValues(['params', 'roleName'], ['user', 'role', 'name']),
    ]),
  )
  @Delete('/:roleName/label/:label')
  async removeLabelFromRole(
    @Param('roleName') roleName: string,
    @Param('label') label: string,
  ): Promise<void> {
    console.log(roleName, label);
  }
}
