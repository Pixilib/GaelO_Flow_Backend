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

@Controller('/queues/anon')
export class QueuesAnonController {
  constructor(private readonly QueuesAnonService: QueuesAnonService) {}

  @UseGuards(AdminGuard)
  @Delete()
  async flushQueue(): Promise<void> {
    await this.QueuesAnonService.flush();
  }

  @UseGuards(AnonymizeGuard, AdminGuard)
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

  @UseGuards(AnonymizeGuard)
  @Delete(':uuid')
  async removeAnonJob(@Param('uuid') uuid: string): Promise<void> {
    this.QueuesAnonService.removeJob({ uuid: uuid });
  }
}
