import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QueuesDeleteService } from './queueDeletes.service';
import { DeleteGuard } from '../../roles/roles.guard';
import { Job } from 'bullmq';
import { QueuesDeleteDto } from './queueDeletes.dto';
import { randomUUID } from 'crypto';

@Controller('/queues/delete')
export class QueuesDeleteController {
  constructor(private readonly QueuesDeleteService: QueuesDeleteService) {}

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
      this.QueuesDeleteService.addDeleteJob({
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
    this.QueuesDeleteService.removeDeleteJob({ uuid: uuid });
  }

  @UseGuards(DeleteGuard)
  @Get(':uuid')
  async getJobsForUuid(@Param('uuid') uuid: string): Promise<Object> {
    const jobs: Job<any, any, string>[] | null =
      await this.QueuesDeleteService.getJobs(uuid);

    console.log(jobs);

    const resultsProgressPromises = jobs.map(async (job) => {
      if (job.data.uuid == uuid) {
        const orthancSeriesId = job.data.orthancSeriesId;
        const progress = {progress: job.progress, state: await job.getState(), id: job.id};
        return { [orthancSeriesId]: progress };
      }
      return null;
    });

    const resultsProgress = await Promise.all(resultsProgressPromises);
    return resultsProgress;
  }

  @UseGuards(DeleteGuard)
  @Get()
  async getUuidOfUser(@Req() request: Request): Promise<Object> {
    const uuid = await this.QueuesDeleteService.getUuidOfUser(request['user'].userId);
    return { uuid: uuid };
  }
}
