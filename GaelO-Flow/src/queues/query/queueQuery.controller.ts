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
import { QueuesQueryService } from './queueQuery.service';
import { AdminGuard, QueryGuard } from '../../roles/roles.guard';
import { Job } from 'bullmq';
import {
  QueuesQueryDto,
  QueuesQueryStudyDto,
  QueuesQuerySeriesDto,
} from './queueQuery.dto';
import { randomUUID } from 'crypto';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrGuard } from '../../utils/orGuards';

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
  @ApiResponse({ status: 200, description: 'Get all jobs', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'uuid', required: false })
  @UseGuards(new OrGuard([new QueryGuard(), new AdminGuard()]))
  @Get()
  async getJobs(
    @Query('userId') userId: number,
    @Query('uuid') uuid: string,
    @Req() request: Request,
  ): Promise<object> {
    const user = request['user'];

    if (!userId && !uuid) {
      if (user.role.admin) {
        return await this.QueuesQueryService.getJobsForUuid(); // get all jobs;
      } else {
        throw new ForbiddenException("You don't have access to this resource");
      }
    }

    if (userId && !uuid) {
      if (user.role.admin || user.userId == userId) {
        const uuid = await this.QueuesQueryService.getUuidOfUser(userId);
        return { uuid: uuid };
      } else {
        throw new ForbiddenException("You don't have access to this resource");
      }
    }

    if (uuid) {
      if (
        user.role.admin ||
        (await this.QueuesQueryService.getUuidOfUser(user.userId)) == uuid
      ) {
        return await this.QueuesQueryService.getJobsForUuid(uuid);
      } else {
        throw new ForbiddenException("You don't have access to this resource");
      }
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
  ): Promise<Object> {
    const user = request['user'];

    if (await this.QueuesQueryService.checkIfUserIdHasJobs(user.userId))
      throw new ForbiddenException('User already has jobs');

    const queuesQueryStudy: QueuesQueryStudyDto[] = queuesQueryDto.studies;
    const queuesQuerySeries: QueuesQuerySeriesDto[] = queuesQueryDto.series;

    if (queuesQuerySeries.length === 0 && queuesQueryStudy.length === 0)
      throw new BadRequestException('No studies or series found');

    const uuid = randomUUID();
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
    return { uuid };
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
