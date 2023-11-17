import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QueuesService } from './queues.service';
import { DeleteGuard } from '../roles/roles.guard';
import { Job } from 'bullmq';
import { QueuesDeleteDto } from './queues.dto';
import { randomUUID } from 'crypto';

@Controller('/queues')
export class QueuesController {
  constructor(private readonly QueuesService: QueuesService) {}

  @UseGuards(DeleteGuard)
  @Post('/delete')
  async addDeleteJob(
    @Body() queuesDeleteDto: QueuesDeleteDto,
    @Req() request: Request,
  ): Promise<Object> {
    const user = request['user'];

    if (await this.QueuesService.checkIfUserIdHasJobs(user.userId))
      throw new ForbiddenException('User already has jobs');

    const orthancSeriesIds = queuesDeleteDto.orthancSeriesIds;
    const uuid = randomUUID();
    orthancSeriesIds.forEach((orthancSeriesId) => {
      this.QueuesService.addDeleteJob({
        uuid: uuid,
        userId: user.userId,
        orthancSeriesId: orthancSeriesId,
      });
    });
    return { uuid };
  }

  @UseGuards(DeleteGuard)
  @Delete('/delete')
  async removeDeleteJob(@Req() request: Request): Promise<void> {
    const user = request['user'];

    this.QueuesService.removeDeleteJob({ userId: user.userId });
  }

  @UseGuards(DeleteGuard)
  @Get('/delete/:uuid')
  async getJobsForUuid(@Param('uuid') uuid: string): Promise<Object> {
    const jobs: Job<any, any, string>[] | null =
      await this.QueuesService.getJobs(uuid);

    const resultsProgressPromises = jobs.map(async (job) => {
      if (job.data.uuid == uuid) {
        const orthancSeriesId = job.data.orthancSeriesId;
        const progress = await this.QueuesService.getJobProgress(job.id);
        return { [orthancSeriesId]: progress };
      }
      return null;
    });

    const resultsProgress = await Promise.all(resultsProgressPromises);
    return resultsProgress;
  }

  @UseGuards(DeleteGuard)
  @Get()
  async getJobs(): Promise<Object> {
    const jobs: Job<any, any, string>[] | null =
      await this.QueuesService.getJobs();
    return { queue: jobs ? jobs : [] };
  }
}
