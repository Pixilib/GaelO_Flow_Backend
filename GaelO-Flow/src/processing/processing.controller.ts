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
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from '../roles/roles.guard';
import { ProcessingQueueService } from './processingQueue.service';
import { ProcessingJobDto } from './processingJob.dto';
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
  @ApiResponse({ status: 200, description: 'Get all uuids', type: [String] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({ name: 'userId', required: false })
  @UseGuards(
    new OrGuard([new AdminGuard(), new CheckUserId(['query', 'userId'])]),
  )
  @Get()
  async getUuid(
    @Query('userId') userId: number,
    @Req() request: Request,
  ): Promise<object> {
    const user = request['user'];

    if (!userId && user.role.Admin) {
      return await this.processingQueueService.getAllUuids();
    } else {
      return await this.processingQueueService.getUuidsOfUser(userId);
    }
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Get all jobs for the uuid',
    type: Object,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiParam({ name: 'uuid', required: true })
  @Get(':uuid')
  async getJobs(
    @Param('uuid') uuid: string,
    @Req() request: Request,
  ): Promise<object> {
    const user = request['user'];

    if (!uuid) throw new BadRequestException('Uuid is required');

    const uuidsOfUser = await this.processingQueueService.getUuidsOfUser(
      user.userId,
    );

    if (user.role.Admin || uuidsOfUser.includes(uuid)) {
      const jobs = await this.processingQueueService.getJobs(undefined, uuid);
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
    } else {
      throw new ForbiddenException("You don't have access to this resource");
    }
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
    @Body() processingJobDto: ProcessingJobDto,
  ): Promise<Object> {
    const user = request['user'];

    return {
      JobId: await this.processingQueueService.addJob(
        user.UserId,
        processingJobDto,
      ),
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
