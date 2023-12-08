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
import { QueuesAnonService } from './queueAnons.service';
import { AdminGuard, AnonymizeGuard } from '../../roles/roles.guard';
import { Job } from 'bullmq';
import { QueuesAnonsDto } from './queueAnons.dto';
import { randomUUID } from 'crypto';

@Controller('/queues/anon')
export class QueuesAnonController {
  constructor(private readonly QueuesAnonService: QueuesAnonService) {}

  @UseGuards(AdminGuard)
  @Delete()
  async flushQueue(): Promise<void> {
    console.log('Flushing queue');
    await this.QueuesAnonService.flush();
  }

  @UseGuards(AdminGuard)
  @Get('all')
  async getAllJobs(): Promise<Object> {
    const jobs: Job<any, any, string>[] | null =
      await this.QueuesAnonService.getJobs();

    const resultsProgressPromises = jobs.map(async (job) => {
        const orthancSeriesId = job.data.orthancSeriesId;
        const progress = {
          progress: job.progress,
          state: job.data.state,
          id: job.id,
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

  @UseGuards(AnonymizeGuard)
  @Post()
  async addAnonJob(
    @Body() queuesAnonsDto: QueuesAnonsDto,
    @Req() request: Request,
  ): Promise<Object> {
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
      });
    });
    return { uuid };
  }

  @UseGuards(AnonymizeGuard)
  @Delete(':uuid')
  async removeAnonJob(@Param('uuid') uuid: string): Promise<void> {
    this.QueuesAnonService.removeJob({ uuid: uuid });
  }

  @UseGuards(AnonymizeGuard)
  @Get(':uuid')
  async getJobsForUuid(@Param('uuid') uuid: string): Promise<Object> {
    const jobs: Job<any, any, string>[] | null =
      await this.QueuesAnonService.getJobs(uuid);

    const resultsProgressPromises = jobs.map(async (job) => {
      if (job.data.uuid == uuid) {
        const orthancSeriesId = job.data.orthancSeriesId;
        const progress = {
          progress: job.progress,
          state: job.data.state,
          id: job.id,
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

  @UseGuards(AnonymizeGuard)
  @Get()
  async getUuidOfUser(@Req() request: Request): Promise<Object> {
    const uuid = await this.QueuesAnonService.getUuidOfUser(
      request['user'].userId,
    );
    return { uuid: uuid };
  }
}
