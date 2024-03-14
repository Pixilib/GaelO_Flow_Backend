import {
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
import { QueuesDeleteService } from './queueDeletes.service';
import { AdminGuard, DeleteGuard } from '../../roles/roles.guard';
import { QueuesDeleteDto } from './queueDeletes.dto';
import { randomUUID } from 'crypto';
import {
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { Job } from 'bullmq';
import { OrGuard } from '../../utils/orGuards';

@ApiTags('queues/delete')
@Controller('/queues/delete')
export class QueuesDeleteController {
  constructor(private readonly QueuesDeleteService: QueuesDeleteService) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'queue flushed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Delete()
  async flushQueue(): Promise<void> {
    await this.QueuesDeleteService.flush();
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get all jobs', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'uuid', required: false })
  @UseGuards(new OrGuard([new DeleteGuard(), new AdminGuard()]))
  @Get()
  async getJobs(
    @Query('userId') userId: number,
    @Query('uuid') uuid: string,
    @Req() request: Request,
  ): Promise<object> {
    const user = request['user'];

    if (!userId && !uuid) {
      if (user.Role.Admin) {
        return await this.QueuesDeleteService.getJobsForUuid(); // get all jobs;
      } else {
        throw new ForbiddenException("You don't have access to this resource");
      }
    }

    if (userId && !uuid) {
      if (user.Role.Admin || user.UserId == userId) {
        const uuid = await this.QueuesDeleteService.getUuidOfUser(userId);
        return { uuid: uuid };
      } else {
        throw new ForbiddenException("You don't have access to this resource");
      }
    }

    if (uuid) {
      if (
        user.Role.Admin ||
        (await this.QueuesDeleteService.getUuidOfUser(user.userId)) == uuid
      ) {
        return await this.QueuesDeleteService.getJobsForUuid(uuid);
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
  @UseGuards(DeleteGuard)
  @Post()
  async addDeleteJob(
    @Body() queuesDeleteDto: QueuesDeleteDto,
    @Req() request: Request,
  ): Promise<object> {
    const user = request['user'];

    if (await this.QueuesDeleteService.checkIfUserIdHasJobs(user.userId))
      throw new ForbiddenException('User already has jobs');

    const orthancSeriesIds = queuesDeleteDto.OrthancSeriesIds;
    const uuid = randomUUID();
    orthancSeriesIds.forEach((orthancSeriesId) => {
      this.QueuesDeleteService.addJob({
        uuid: uuid,
        userId: user.userId,
        orthancSeriesId: orthancSeriesId,
        results: null,
      });
    });
    return { Uuid: uuid };
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Remove job' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(DeleteGuard)
  @Delete(':uuid')
  async removeDeleteJob(@Param('uuid') uuid: string): Promise<void> {
    this.QueuesDeleteService.removeJob({ Uuid: uuid });
  }
}
