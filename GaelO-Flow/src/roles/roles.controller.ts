import { Body, Controller, Get , Post} from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller()
export class RolesController {
  constructor(private readonly RoleService: RolesService) {}

  @Get()
  getHello(): string {
    return "test";
  }
}