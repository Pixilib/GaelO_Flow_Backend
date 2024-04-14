import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Put,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from '../users/users.service';
import { LabelsService } from '../labels/labels.service';
import { RolesService } from './roles.service';

import { Role } from './role.entity';
import { RoleDto, WithLabels } from './roles.dto';

import { NotFoundInterceptor } from '../interceptors/not-found.interceptor';

import { AdminGuard } from '../guards/roles.guard';
import { OrGuard } from '../guards/or.guard';
import { CheckUserRoleGuard } from '../guards/check-user-role.guard';

@ApiTags('roles')
@Controller('/roles')
export class RolesController {
  constructor(
    private readonly roleService: RolesService,
    private readonly labelService: LabelsService,
    private readonly userService: UsersService,
  ) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get all roles', type: [Role] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get()
  async findAll(@Query() withLabels: WithLabels): Promise<Role[]> {
    const allRoles = await this.roleService.findAll();
    if (withLabels.WithLabels) {
      const allRoleLabels = await this.roleService.getAllRoleLabels();
      allRoles.forEach((role) => {
        role['labels'] = allRoleLabels
          .filter((roleLabel) => roleLabel.Role.Name === role.Name)
          .map((roleLabel) => roleLabel.Label.Name);
      });
    }

    return allRoles;
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get role by name', type: Role })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get('/:name')
  async findOne(@Param('name') name: string): Promise<Role> {
    const role = await this.roleService.findOneByOrFail(name);
    return role;
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'Create role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @ApiBody({ type: RoleDto })
  @Post()
  async CreateRole(@Body() roleDto: RoleDto): Promise<void> {
    const role = new Role();

    if (roleDto.Name == undefined)
      throw new BadRequestException("Missing Primary Key 'name'");

    if ((await this.roleService.isRoleExist(roleDto.Name)) != null)
      throw new ConflictException('Role with this name already exists');

    role.Name = roleDto.Name;
    role.Import = roleDto.Import;
    role.Anonymize = roleDto.Anonymize;
    role.Export = roleDto.Export;
    role.Query = roleDto.Query;
    role.AutoQuery = roleDto.AutoQuery;
    role.Delete = roleDto.Delete;
    role.Admin = roleDto.Admin;
    role.Modify = roleDto.Modify;
    role.CdBurner = roleDto.CdBurner;
    role.AutoRouting = roleDto.AutoRouting;

    await this.roleService.create(role);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Delete role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Delete('/:name')
  async delete(@Param('name') name: string): Promise<void> {
    const role = await this.roleService.findOneByOrFail(name);

    if (await this.userService.isRoleUsed(role.Name))
      throw new ForbiddenException('Role is used');

    return this.roleService.remove(name);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Update role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Put('/:name')
  async update(
    @Param('name') name: string,
    @Body() roleDto: RoleDto,
  ): Promise<void> {
    const role = await this.roleService.findOneByOrFail(name);

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
  @ApiBody({ schema: { example: { label: 'label' } } })
  @UseGuards(
    new OrGuard([
      new AdminGuard(),
      new CheckUserRoleGuard(['params', 'roleName']),
    ]),
  )
  @UseInterceptors(NotFoundInterceptor)
  @Post('/:roleName/label')
  async addLabelToRole(
    @Param('roleName') roleName: string,
    @Body() labelDto: { label: string },
  ): Promise<void> {
    await this.roleService.findOneByOrFail(roleName);
    const label = await this.labelService.findOneByOrFail(labelDto.label);

    const roleLabel = await this.roleService.getRoleLabels(roleName);
    if (roleLabel.find((roleLabel) => roleLabel.Label.Name === label.Name))
      throw new ConflictException('Label already exists for this role');

    await this.roleService.addRoleLabel(roleName, labelDto.label);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get all labels from role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(
    new OrGuard([
      new AdminGuard(),
      new CheckUserRoleGuard(['params', 'roleName']),
    ]),
  )
  @Get('/:roleName/labels')
  async getRoleLabels(@Param('roleName') roleName: string): Promise<string[]> {
    const allRoleLabels = await this.roleService.getRoleLabels(roleName);
    const labels = allRoleLabels.map((roleLabel) => roleLabel.Label.Name);
    return labels;
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Remove label from role' })
  @ApiResponse({
    status: 400,
    description: 'Label does not exist for this role',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(
    new OrGuard([
      new AdminGuard(),
      new CheckUserRoleGuard(['params', 'roleName']),
    ]),
  )
  @Delete('/:roleName/label/:label')
  async removeLabelFromRole(
    @Param('roleName') roleName: string,
    @Param('label') label: string,
  ): Promise<void> {
    await this.roleService.findOneByOrFail(roleName);
    const labels = (await this.roleService.getRoleLabels(roleName)).map(
      (roleLabel) => roleLabel.Label.Name,
    );
    if (!labels.includes(label))
      throw new BadRequestException('Label does not exist for this role');

    await this.roleService.removeRoleLabel(roleName, label);
  }
}
