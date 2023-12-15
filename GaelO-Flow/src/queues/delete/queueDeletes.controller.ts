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
import { Job } from 'bullmq';
import { QueuesDeleteDto } from './queueDeletes.dto';
import { randomUUID } from 'crypto';
import { promises } from 'dns';

@Controller('/queues/delete')
export class QueuesDeleteController {
  constructor(private readonly QueuesDeleteService: QueuesDeleteService) {}

  @UseGuards(AdminGuard)
  @Delete()
  async flushQueue(): Promise<void> {
    await this.QueuesDeleteService.flush();
  }

  @UseGuards(DeleteGuard || AdminGuard)
  @Get('?')
  async getJobs(
    @Query('userId') userId: number,
    @Query('uuid') uuid: string,
    @Req() request: Request,
  ): Promise<Object> {
    const user = request['user'];

    if (!userId && !uuid) {
      if (user.role.admin) {
        return await this.QueuesDeleteService.getJobs();
      } else {
        throw new ForbiddenException("You don't have access to this resource");
      }
    }

    if (userId && !uuid) {
      if (user.role.admin || user.userId == userId) {
        const uuid = await this.QueuesDeleteService.getUuidOfUser(userId);
        return { uuid: uuid };
      } else {
        throw new ForbiddenException("You don't have access to this resource");
      }
    }

    if (uuid) {
      if (user.role.admin || await this.QueuesDeleteService.getUuidOfUser(user.userId) == uuid) {
        return await this.QueuesDeleteService.getJobsForUuid(uuid);
      } else {
        throw new ForbiddenException("You don't have access to this resource");
      }
    }
  }

  @UseGuards(DeleteGuard)
  @Post()
  async addDeleteJob(
    @Body() queuesDeleteDto: QueuesDeleteDto,
    @Req() request: Request,
  ): Promise<Object> {
    const user = request['user'];

    if (await this.QueuesDeleteService.checkIfUserIdHasJobs(user.userId))
      throw new ForbiddenException('User already has jobs');

    const orthancSeriesIds = queuesDeleteDto.orthancSeriesIds;
    const uuid = randomUUID();
    orthancSeriesIds.forEach((orthancSeriesId) => {
      this.QueuesDeleteService.addJob({
        uuid: uuid,
        userId: user.userId,
        orthancSeriesId: orthancSeriesId,
      });
    });
    return { uuid };
  }

  @UseGuards(DeleteGuard)
  @Delete(':uuid')
  async removeDeleteJob(@Param('uuid') uuid: string): Promise<void> {
    this.QueuesDeleteService.removeJob({ uuid: uuid });
  }
}
