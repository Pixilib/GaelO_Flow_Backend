import { QueuesAnonService } from './queue-anons.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, AnonymizeGuard } from '../../guards/roles.guard';
import { QueuesAnonsDto } from './queue-anons.dto';
import { randomUUID } from 'crypto';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrGuard } from '../../guards/or.guard';

@ApiTags('queues/anon')
@Controller('/queues/anon')
export class QueuesAnonController {
  constructor(private readonly QueuesAnonService: QueuesAnonService) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'queue flushed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Delete()
  async flushQueue(): Promise<void> {
    await this.QueuesAnonService.flush();
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get all uuids', type: [String] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({ name: 'userId', required: false })
  @UseGuards(new OrGuard([new AnonymizeGuard(), new AdminGuard()]))
  @Get()
  async getUuid(
    @Query('userId') userId: number,
    @Req() request: Request,
  ): Promise<object> {
    const user = request['user'];

    if (!userId && user.role.Admin) {
      return await this.QueuesAnonService.getAllUuids();
    } else if (userId && (user.userId == userId || user.role.Admin)) {
      const uuid = await this.QueuesAnonService.getUuidOfUser(userId);
      return uuid ? [uuid] : [];
    } else {
      throw new ForbiddenException("You don't have access to this resource");
    }
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Get all jobs for the uuid',
    type: Object,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiParam({ name: 'uuid', required: true })
  @UseGuards(new OrGuard([new AnonymizeGuard(), new AdminGuard()]))
  @Get(':uuid')
  async getJobs(
    @Param('uuid') uuid: string,
    @Req() request: Request,
  ): Promise<object> {
    const user = request['user'];

    if (!uuid) throw new BadRequestException('Uuid is required');

    const uuidOfUser = await this.QueuesAnonService.getUuidOfUser(user.userId);

    if (user.role.Admin || uuidOfUser == uuid) {
      return await this.QueuesAnonService.getJobsForUuid(uuid);
    } else {
      throw new ForbiddenException("You don't have access to this resource");
    }
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Add job', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User already has jobs',
  })
  @UseGuards(AnonymizeGuard)
  @Post()
  async addAnonJob(
    @Body() queuesAnonsDto: QueuesAnonsDto,
    @Req() request: Request,
  ): Promise<object> {
    const user = request['user'];

    if (await this.QueuesAnonService.checkIfUserIdHasJobs(user.userId))
      throw new ForbiddenException('User already has jobs');

    const anonymizes = queuesAnonsDto.Anonymizes;
    const uuid = randomUUID();
    anonymizes.forEach((anonymize) => {
      this.QueuesAnonService.addJob({
        uuid: uuid,
        userId: user.userId,
        anonymize: anonymize,
        results: null,
      });
    });
    return { Uuid: uuid };
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Remove job' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AnonymizeGuard)
  @Delete(':uuid')
  async removeAnonJob(@Param('uuid') uuid: string): Promise<void> {
    this.QueuesAnonService.removeJob({ Uuid: uuid });
  }
}
