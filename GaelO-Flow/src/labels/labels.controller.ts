import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ConflictException,
  UseInterceptors,
} from '@nestjs/common';
import { LabelsService } from './labels.service';
import { Label } from './label.entity';
import { LabelDto } from './labels.dto';
import { NotFoundInterceptor } from './../interceptors/NotFoundInterceptor';

@Controller('/labels')
export class LabelsController {
  constructor(private readonly LabelsService: LabelsService) {}

  @Get()
  async findAll(): Promise<Label[]> {
    return this.LabelsService.findAll();
  }

  @Delete('/:label_name')
  @UseInterceptors(NotFoundInterceptor)
  async remove(@Param('label_name') label_name: string): Promise<void> {
    await this.LabelsService.findOneByOrFail(label_name); // TODO: replace with findOneByOrFail
    return this.LabelsService.remove(label_name);
  }

  @Post()
  async create(@Body() labelDto: LabelDto): Promise<void> {
    if (await this.LabelsService.findOneByOrFail(labelDto.label_name))
      throw new ConflictException('Label with this name already exists');

    return this.LabelsService.create(labelDto);
  }
}
