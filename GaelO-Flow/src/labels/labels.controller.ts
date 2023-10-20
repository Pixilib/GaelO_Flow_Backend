import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { LabelsService } from './labels.service';
import { Label } from './label.entity';
import { LabelDto } from './labels.dto';

@Controller('/labels')
export class LabelsController {
  constructor(private readonly LabelsService: LabelsService) {}

  @Get()
  async findAll(): Promise<Label[]> {
    return this.LabelsService.findAll();
  }

  @Delete('/:label_name')
  async remove(@Param('label_name') label_name: string): Promise<void> {
    const label = await this.LabelsService.findOne(label_name); // TODO: replace with findOneByOrFail
    if (!label) throw new NotFoundException('Label not found');
    return this.LabelsService.remove(label_name);
  }

  @Post()
  async create(@Body() labelDto: LabelDto): Promise<void> {
    if (!labelDto.label_name)
      throw new BadRequestException("Missing Primary Key 'label_name'");

    const label = new Label();

    label.label_name = labelDto.label_name;

    if (await this.LabelsService.findOne(labelDto.label_name))
      throw new ConflictException('Label with this name already exists');

    return this.LabelsService.create(label);
  }
}
