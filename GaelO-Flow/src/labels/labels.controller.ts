import { Body, Controller, Get, Post, Delete, HttpException, Param } from '@nestjs/common';
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
    const label = await this.LabelsService.findOne(label_name);
    if (!label) throw new HttpException('Label not found', 404);
    return this.LabelsService.remove(label_name);
  }

  @Post()
  async create(@Body() labelDto: LabelDto): Promise<Label> {
    if (!labelDto.label_name) throw new HttpException("Missing Primary Key 'label_name'", 400);

    const label = new Label();

    label.label_name = labelDto.label_name;

    if (await this.LabelsService.findOne(labelDto.label_name))
      throw new HttpException('Label with this name already exists', 409);

    return this.LabelsService.create(labelDto);
  }
}
