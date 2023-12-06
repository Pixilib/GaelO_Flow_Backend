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
import { AdminGuard, DeleteGuard } from '../../roles/roles.guard';
import { Job } from 'bullmq';
import { QueuesDeleteDto } from './queueDeletes.dto';
import { randomUUID } from 'crypto';

@Controller('/queues/delete')
export class QueuesDeleteController {
  constructor(private readonly QueuesDeleteService: QueuesDeleteService) {}

  @UseGuards(AdminGuard)
  @Delete('flush')
  async flushQueue(): Promise<void> {
    console.log('Flushing queue');
    let jobs = await this.QueuesDeleteService.getJobs();
    while (jobs.length > 0) {
      jobs.forEach((job) => {
        console.log('Flushing job', job.data.orthancSeriesId);
        job.updateData({
          aborted: true,
        })
        console.log(job.data.aborted);
      });
      this.QueuesDeleteService.removeJob();
      jobs = await this.QueuesDeleteService.getJobs();
    }
  }

  @UseGuards(AdminGuard)
  @Get('all')
  async getAllJobs(): Promise<Object> {
    const jobs: Job<any, any, string>[] | null =
      await this.QueuesDeleteService.getJobs();

    const resultsProgressPromises = jobs.map(async (job) => {
        const orthancSeriesId = job.data.orthancSeriesId;
        const progress = {
          progress: job.progress,
          state: job.data.state,
          id: job.id,
          aborted: job.data.aborted,
        };
        return { [orthancSeriesId]: progress };
    });

    let resultsProgress = await Promise.all(resultsProgressPromises);

    let results = {};
    resultsProgress.forEach((result) => {
      if (result != null) {
        Object.assign(results, result);
      }
    });

    return results;
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
        aborted: false,
      });
    });
    return { uuid };
  }

  @UseGuards(DeleteGuard)
  @Delete(':uuid')
  async removeDeleteJob(@Param('uuid') uuid: string): Promise<void> {
    this.QueuesDeleteService.removeJob({ uuid: uuid });
  }

  @UseGuards(DeleteGuard)
  @Get(':uuid')
  async getJobsForUuid(@Param('uuid') uuid: string): Promise<Object> {
    const jobs: Job<any, any, string>[] | null =
      await this.QueuesDeleteService.getJobs(uuid);

    const resultsProgressPromises = jobs.map(async (job) => {
      if (job.data.uuid == uuid) {
        const orthancSeriesId = job.data.orthancSeriesId;
        const progress = {
          progress: job.progress,
          state: job.data.state,
          id: job.id,
          aborted: job.data.aborted,
        };
        return { [orthancSeriesId]: progress };
      }
      return null;
    });

    let resultsProgress = await Promise.all(resultsProgressPromises);

    let results = {};
    resultsProgress.forEach((result) => {
      if (result != null) {
        Object.assign(results, result);
      }
    });

    return results;
  }

  @UseGuards(DeleteGuard)
  @Get()
  async getUuidOfUser(@Req() request: Request): Promise<Object> {
    const uuid = await this.QueuesDeleteService.getUuidOfUser(
      request['user'].userId,
    );
    return { uuid: uuid };
  }
}
