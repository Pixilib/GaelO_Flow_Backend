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
import { QueuesAnonService } from './queueAnons.service';
import { AdminGuard, AnonymizeGuard } from '../../roles/roles.guard';
import { Job } from 'bullmq';
import { QueuesAnonsDto } from './queueAnons.dto';
import { randomUUID } from 'crypto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrGuard } from '../../utils/orGuards';

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
  @ApiResponse({ status: 200, description: 'Get all jobs', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'uuid', required: false })
  @UseGuards(new OrGuard([new AnonymizeGuard(), new AdminGuard()]))
  @Get()
  async getJobs(
    @Query('userId') userId: number,
    @Query('uuid') uuid: string,
    @Req() request: Request,
  ): Promise<object> {
    const user = request['user'];

    if (!userId && !uuid) {
      if (user.role.admin) {
        return await this.QueuesAnonService.getJobsForUuid(); // get all jobs;
      } else {
        throw new ForbiddenException("You don't have access to this resource");
      }
    }

    if (userId && !uuid) {
      if (user.role.admin || user.userId == userId) {
        const uuid = await this.QueuesAnonService.getUuidOfUser(userId);
        return { uuid: uuid };
      } else {
        throw new ForbiddenException("You don't have access to this resource");
      }
    }

    if (uuid) {
      if (
        user.role.admin ||
        (await this.QueuesAnonService.getUuidOfUser(user.userId)) == uuid
      ) {
        return await this.QueuesAnonService.getJobsForUuid(uuid);
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
  @UseGuards(AnonymizeGuard)
  @Post()
  async addAnonJob(
    @Body() queuesAnonsDto: QueuesAnonsDto,
    @Req() request: Request,
  ): Promise<object> {
    const user = request['user'];

    if (await this.QueuesAnonService.checkIfUserIdHasJobs(user.userId))
      throw new ForbiddenException('User already has jobs');

    const anonymizes = queuesAnonsDto.anonymizes;
    const uuid = randomUUID();
    anonymizes.forEach((anonymize) => {
      this.QueuesAnonService.addJob({
        uuid: uuid,
        userId: user.userId,
        anonymize: anonymize,
        results: null,
      });
    });
    return { uuid };
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Remove job' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AnonymizeGuard)
  @Delete(':uuid')
  async removeAnonJob(@Param('uuid') uuid: string): Promise<void> {
    this.QueuesAnonService.removeJob({ uuid: uuid });
  }
}
