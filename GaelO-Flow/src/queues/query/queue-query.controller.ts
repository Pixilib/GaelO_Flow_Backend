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
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { QueuesQueryService } from './queue-query.service';
import { AdminGuard, QueryGuard } from '../../guards/roles.guard';
import {
  QueuesQueryDto,
  QueuesQueryStudyDto,
  QueuesQuerySeriesDto,
} from './queue-query.dto';
import { OrGuard } from '../../guards/or.guard';
import { generateRandomUUID } from '../../utils/passwords';

@ApiTags('queues/query')
@Controller('/queues/query')
export class QueuesQueryController {
  constructor(private readonly QueuesQueryService: QueuesQueryService) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'queue flushed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Delete()
  async flushQueue(): Promise<void> {
    await this.QueuesQueryService.flush();
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get all uuids', type: [String] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({ name: 'userId', required: false })
  @UseGuards(OrGuard([AdminGuard, QueryGuard]))
  @Get()
  async getUuid(
    @Query('userId') userId: number,
    @Req() request: Request,
  ): Promise<object> {
    const user = request['user'];

    if (!userId && user.role.Admin) {
      return await this.QueuesQueryService.getAllUuids();
    } else if (userId && (user.userId == userId || user.role.Admin)) {
      const uuid = await this.QueuesQueryService.getUuidOfUser(userId);
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
  @UseGuards(OrGuard([AdminGuard, QueryGuard]))
  @Get(':uuid')
  async getJobs(
    @Param('uuid') uuid: string,
    @Req() request: Request,
  ): Promise<object> {
    const user = request['user'];

    if (!uuid) throw new BadRequestException('Uuid is required');

    const uuidOfUser = await this.QueuesQueryService.getUuidOfUser(user.userId);

    if (user.role.Admin || uuidOfUser == uuid) {
      return await this.QueuesQueryService.getJobsForUuid(uuid);
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
  @UseGuards(QueryGuard)
  @Post()
  async addQueryJob(
    @Body() queuesQueryDto: QueuesQueryDto,
    @Req() request: Request,
  ): Promise<object> {
    const user = request['user'];

    if (await this.QueuesQueryService.checkIfUserIdHasJobs(user.userId))
      throw new ForbiddenException('User already has jobs');

    const queuesQueryStudy: QueuesQueryStudyDto[] = queuesQueryDto.Studies;
    const queuesQuerySeries: QueuesQuerySeriesDto[] = queuesQueryDto.Series;

    if (queuesQuerySeries.length === 0 && queuesQueryStudy.length === 0)
      throw new BadRequestException('No studies or series found');

    const uuid = generateRandomUUID();
    queuesQueryStudy.forEach((study) => {
      this.QueuesQueryService.addJob({
        uuid: uuid,
        userId: user.userId,
        study: study,
        results: null,
      });
    });
    queuesQuerySeries.forEach((series) => {
      this.QueuesQueryService.addJob({
        uuid: uuid,
        userId: user.userId,
        series: series,
        results: null,
      });
    });
    return { Uuid: uuid };
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Remove job' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(QueryGuard)
  @Delete(':uuid')
  async removeQueryJob(@Param('uuid') uuid: string): Promise<void> {
    this.QueuesQueryService.removeJob({ uuid: uuid });
  }
}
