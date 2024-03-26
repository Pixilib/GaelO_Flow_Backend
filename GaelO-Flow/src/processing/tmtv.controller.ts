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
import { Job } from 'bullmq';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../roles/roles.guard';
import { ProcessingQueueService } from './processingQueue.service';
import { NewProcessingJobDto } from './dto/newProcessingJob.dto';
import { OrGuard } from '../utils/orGuards';
import { CheckUserId } from '../utils/CheckUserId.guard';

@ApiTags('processing')
@Controller('/processing')
export class ProcessingController {
  constructor(
    private readonly processingQueueService: ProcessingQueueService,
  ) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'queue flushed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Delete()
  async flushQueue(): Promise<void> {
    await this.processingQueueService.flush();
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Get all jobs that the user created',
    type: Object,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({ name: 'jobId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @Get()
  @UseGuards(
    new OrGuard([new AdminGuard(), new CheckUserId(['query', 'userId'])]),
  )
  async getJobs(
    @Req() request: Request,
    @Query('jobId') jobId: string,
    @Query('userId') userId: number,
  ): Promise<object> {
    const user = request['user'];
    const jobIdsOfUser = await this.processingQueueService.getJobIdsOfUser(
      user.userId,
    );
    if (jobId && !jobIdsOfUser.includes(jobId) && !user.role.Admin)
      throw new BadRequestException('JobId not found');

    const jobs = await this.processingQueueService.getJobs(userId, jobId);
    const results = [];
    jobs.forEach((job: Job<any, any, string>) => {
      results.push({
        Progress: job.progress,
        State: job.data.state,
        Id: job.id,
        Results: job.data.results,
      });
    });

    return results;
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: 'Add job and returns the JobId',
    type: Object,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  async addJob(
    @Req() request: Request,
    @Body() newProcessingJobDto: NewProcessingJobDto,
  ): Promise<Object> {
    const user = request['user'];

    return {
      JobId: await this.processingQueueService.addJob({
        newProcessingJobDto,
        user,
      }),
    };
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Remove job' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Delete(':uuid')
  async removeQueryJob(@Param('uuid') uuid: string): Promise<void> {
    this.processingQueueService.removeJob({ uuid: uuid });
  }
}
