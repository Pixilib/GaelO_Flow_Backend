import {
    BadRequestException,
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
  import { QueuesQueryService } from './queueQuery.service';
  import { AdminGuard, QueryGuard } from '../../roles/roles.guard';
  import { Job } from 'bullmq';
  import { QueuesQueryDto, QueuesQueryStudyDto, QueuesQuerySeriesDto } from './queueQuery.dto';
  import { randomUUID } from 'crypto';
  
  @Controller('/queues/query')
  export class QueuesQueryController {
    constructor(private readonly QueuesQueryService: QueuesQueryService) {}
  
    @UseGuards(AdminGuard)
    @Delete()
    async flushQueue(): Promise<void> {
      console.log('Flushing queue');
      await this.QueuesQueryService.flush();
    }
  
    @UseGuards(AdminGuard)
    @Get('all')
    async getAllJobs(): Promise<Object> {
      const jobs: Job<any, any, string>[] | null =
        await this.QueuesQueryService.getJobs();
  
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
        });
      });
      queuesQuerySeries.forEach((series) => {
        this.QueuesQueryService.addJob({
          uuid: uuid,
          userId: user.userId,
          series: series,
        });
      })
      return { uuid };
    }
  
    @UseGuards(QueryGuard)
    @Delete(':uuid')
    async removeQueryJob(@Param('uuid') uuid: string): Promise<void> {
      this.QueuesQueryService.removeJob({ uuid: uuid });
    }
  
    @UseGuards(QueryGuard)
    @Get(':uuid')
    async getJobsForUuid(@Param('uuid') uuid: string): Promise<Object> {
      const jobs: Job<any, any, string>[] | null =
        await this.QueuesQueryService.getJobs(uuid);
  
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
  
    @UseGuards(QueryGuard)
    @Get()
    async getUuidOfUser(@Req() request: Request): Promise<Object> {
      const uuid = await this.QueuesQueryService.getUuidOfUser(
        request['user'].userId,
      );
      return { uuid: uuid };
    }
  }
  