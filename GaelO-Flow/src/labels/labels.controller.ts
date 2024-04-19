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
import { AdminGuard } from '../guards/roles.guard';
import { LabelDto } from './labels.dto';

@ApiTags('labels')
@Controller('/labels')
export class LabelsController {
  constructor(private readonly LabelsService: LabelsService) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get all labels', type: [String] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get()
  async findAll(): Promise<string[]> {
    const allLabels = await this.LabelsService.findAll();
    return allLabels.map((label) => label.Name);
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
