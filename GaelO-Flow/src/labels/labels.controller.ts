import { Body, Controller, Get, Post } from '@nestjs/common';
import { LabelsService } from './labels.service';

@Controller()
export class LabelsController {
  constructor(private readonly LabelsService: LabelsService) {}
}
