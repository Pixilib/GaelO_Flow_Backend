import {
  Controller,
  Get,
  UseGuards,
  Body,
  Post,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoRoutingGuard } from '../guards/roles.guard';
import { CreateAutoroutingDto } from './dto/create-autorouting.dto';
import { Autorouting } from './autorouting.entity';
import { AutoroutingsService } from './autoroutings.service';

/**
 * API controllers for autorouting related routes
 */
@ApiTags('autorouting')
@Controller('/autorouting')
export class AutoroutingsController {
  constructor(private autoroutingService: AutoroutingsService) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: 'create autorouting',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AutoRoutingGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async createAutorouting(
    @Body() createAutoroutingDto: CreateAutoroutingDto,
  ): Promise<any> {
    return await this.autoroutingService.create(createAutoroutingDto);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Get all autorouting',
    type: [Autorouting],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AutoRoutingGuard)
  @Get()
  async getAutorouting(): Promise<any> {
    return await this.autoroutingService.findAll();
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'delete autorouting by id',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'id', required: true, type: 'number' })
  @UseGuards(AutoRoutingGuard)
  @Delete('/:id')
  async deleteAutorouting(@Param('id') id: number): Promise<any> {
    await this.autoroutingService.findOneOrFail(id);
    return await this.autoroutingService.remove(id);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'enable autorouting by id',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'id', required: true, type: 'number' })
  @UseGuards(AutoRoutingGuard)
  @Post('/:id/enable')
  async enableAutorouting(@Param('id') id: number): Promise<any> {
    await this.autoroutingService.enable(id);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'disable autorouting by id',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'id', required: true, type: 'number' })
  @UseGuards(AutoRoutingGuard)
  @Post('/:id/disable')
  async disableAutorouting(@Param('id') id: number): Promise<any> {
    await this.autoroutingService.disable(id);
  }
}
