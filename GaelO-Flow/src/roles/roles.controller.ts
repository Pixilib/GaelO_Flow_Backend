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
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from '../users/users.service';
import { LabelsService } from '../labels/labels.service';
import { RolesService } from './roles.service';

import { Role } from './role.entity';

import { AdminGuard } from '../guards/roles.guard';
import { OrGuard } from '../guards/or.guard';
import { CheckUserRoleGuard } from '../guards/check-user-role.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { WithLabels } from './dto/with-labels.dto';
import { LabelDto } from '../labels/labels.dto';
/**
 * Controller for the roles related APIs.
 */
@ApiTags('roles')
@Controller('/roles')
export class RolesController {
  constructor(
    private readonly roleService: RolesService,
    private readonly labelService: LabelsService,
    private readonly userService: UsersService,
  ) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Get all roles',
    type: [GetRoleDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get()
  async findAll(@Query() withLabels: WithLabels): Promise<GetRoleDto[]> {
    if (withLabels.WithLabels)
      return await this.roleService.findAllWithLabels();
    return await this.roleService.findAll();
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
  @ApiBody({ type: CreateRoleDto })
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<void> {
    if (createRoleDto.Name == undefined)
      throw new BadRequestException("Missing Primary Key 'name'");

    if (await this.roleService.isRoleExist(createRoleDto.Name))
      throw new ConflictException('Role with this name already exists');

    await this.roleService.create(createRoleDto);
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
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<void> {
    if ((await this.roleService.isRoleExist(name)) == false)
      throw new NotFoundException('Role not found');

    await this.roleService.update(name, createRoleDto);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Add label to role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ schema: { example: { Name: 'label' } } })
  @UseGuards(OrGuard([AdminGuard, CheckUserRoleGuard]))
  @Post('/:roleName/labels')
  async addLabelToRole(
    @Param('roleName') roleName: string,
    @Body() labelDto: LabelDto,
  ): Promise<void> {
    await this.roleService.findOneByOrFail(roleName);
    if ((await this.labelService.isLabelExist(labelDto.Name)) == false)
      throw new NotFoundException('Label not found');

    await this.roleService.addRoleLabel(roleName, labelDto.Name);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get all labels from role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(OrGuard([AdminGuard, CheckUserRoleGuard]))
  @Get('/:roleName/labels')
  async getRoleLabels(@Param('roleName') roleName: string): Promise<string[]> {
    return (await this.roleService.getRoleLabels(roleName)).map(
      (label) => label.Name,
    );
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Remove label from role' })
  @ApiResponse({
    status: 404,
    description: 'Label does not exist for this role',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(OrGuard([AdminGuard, CheckUserRoleGuard]))
  @Delete('/:roleName/labels/:label')
  async removeLabelFromRole(
    @Param('roleName') roleName: string,
    @Param('label') label: string,
  ): Promise<void> {
    await this.roleService.findOneByOrFail(roleName);
    await this.labelService.findOneByOrFail(label);

    await this.roleService.removeRoleLabel(roleName, label);
  }
}
