import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ConflictException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LabelsService } from './labels.service';
import { AdminGuard, ReadAllGuard } from '../guards/roles.guard';
import { LabelDto } from './labels.dto';
import { OrGuard } from '../guards/or.guard';

/**
 * Controller for the labels related APIs.
 */
@ApiTags('labels')
@Controller('/labels')
export class LabelsController {
  constructor(private readonly LabelsService: LabelsService) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get all labels', type: [String] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(OrGuard([AdminGuard, ReadAllGuard]))
  @Get()
  async findAll(): Promise<string[]> {
    const allLabels = await this.LabelsService.findAll();
    return allLabels.map((label) => label.Name);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Get all labels for a specific role',
    type: [String],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get(':labelName/roles')
  async findAllLAbelForRole(
    @Param('labelName') labelName: string,
  ): Promise<string[]> {
    return (await this.LabelsService.findAllRolesForLabel(labelName)).map(
      (role) => role.Name,
    );
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'remove label' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Delete('/:labelName')
  async remove(@Param('labelName') labelName: string): Promise<void> {
    await this.LabelsService.findOneByOrFail(labelName);
    return this.LabelsService.remove(labelName);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'Create label' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() labelDto: LabelDto): Promise<void> {
    if (await this.LabelsService.isLabelExist(labelDto.Name))
      throw new ConflictException('Label with this name already exists');
    return this.LabelsService.create(labelDto);
  }
}
