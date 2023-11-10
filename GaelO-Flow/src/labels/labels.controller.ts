import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ConflictException,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { LabelsService } from './labels.service';
import { Label } from './label.entity';
import { LabelDto } from './labels.dto';
import { NotFoundInterceptor } from './../interceptors/NotFoundInterceptor';

import { RolesGuard } from '../roles/roles.guard';
import { PermissionAdmin } from '../roles/roles.decorator';

@Controller('/labels')
@UseGuards(RolesGuard)
export class LabelsController {
  constructor(private readonly LabelsService: LabelsService) {}

  @PermissionAdmin()
  @Get()
  async findAll(): Promise<Label[]> {
    return this.LabelsService.findAll();
  }

  @PermissionAdmin()
  @Delete('/:labelName')
  @UseInterceptors(NotFoundInterceptor)
  async remove(@Param('labelName') labelName: string): Promise<void> {
    await this.LabelsService.findOneByOrFail(labelName); // TODO: replace with findOneByOrFail
    return this.LabelsService.remove(labelName);
  }

  @PermissionAdmin()
  @Post()
  async create(@Body() labelDto: LabelDto): Promise<void> {
    if (await this.LabelsService.findOneByOrFail(labelDto.labelName))
      throw new ConflictException('Label with this name already exists');

    return this.LabelsService.create(labelDto);
  }
}
