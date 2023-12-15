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
import { Label } from './label.entity';
import { LabelDto } from './labels.dto';
import { NotFoundInterceptor } from './../interceptors/NotFoundInterceptor';
import { AdminGuard } from '../roles/roles.guard';
import { LabelsService } from './labels.service';

@Controller('/labels')
export class LabelsController {
  constructor(private readonly LabelsService: LabelsService) {}

  @UseGuards(AdminGuard)
  @Get()
  async findAll(): Promise<Label[]> {
    return this.LabelsService.findAll();
  }

  @UseGuards(AdminGuard)
  @Delete('/:labelName')
  @UseInterceptors(NotFoundInterceptor)
  async remove(@Param('labelName') labelName: string): Promise<void> {
    await this.LabelsService.findOneByOrFail(labelName);
    return this.LabelsService.remove(labelName);
  }

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() labelDto: LabelDto): Promise<void> {
    if (await this.LabelsService.findOneByOrFail(labelDto.labelName))
      throw new ConflictException('Label with this name already exists');

    return this.LabelsService.create(labelDto);
  }
}
