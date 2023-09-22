import { Body, Controller, Get , Post, Param, Put, Delete} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('/users')
export class UsersController {
  constructor(private readonly UserService: UsersService) {}

  @Get('/')
  async getUsers(): Promise<User[]> {
    return await this.UserService.findAll();
  }

  @Get('/:id')
  async getUsersId(@Param('id') id :number): Promise<User> {
    return await this.UserService.findOne(id);
  }

  @Put('/:id')
  async update(@Param('id') id :number, @Body() body): Promise<void> {
    return await this.UserService.update(id, body);
  }

  @Delete('/:id')
  async delete(@Param('id') id :number): Promise<void> {
    return await this.UserService.remove(id);
  }

  @Post('/')
  async createUser(@Body() body): Promise<number> {
    return await this.UserService.create(body);
  }
}
