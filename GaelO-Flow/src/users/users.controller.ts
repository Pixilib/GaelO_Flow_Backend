import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  HttpException,
  UseInterceptors,
  UseGuards,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto, GetUserDto, UpdateUserDto } from './users.dto';
import * as bcryptjs from 'bcryptjs';
import { NotFoundInterceptor } from '../interceptors/NotFoundInterceptor';
import { AdminGuard } from '../roles/roles.guard';
import {
  ApiBearerAuth,
  ApiHideProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrGuard } from '../utils/orGuards';
import { CheckUserId } from '../utils/CheckUserId.guard';

@ApiTags('users')
@Controller('/users')
export class UsersController {
  constructor(private readonly UserService: UsersService) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: [GetUserDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getUsers(): Promise<GetUserDto[]> {
    const allUsers = await this.UserService.findAll();
    return allUsers;
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get user by id', type: GetUserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(new OrGuard([new AdminGuard(), new CheckUserId(['params', 'id'])]))
  @Get('/:id')
  @UseInterceptors(NotFoundInterceptor)
  async getUsersId(@Param('id') id: number): Promise<GetUserDto> {
    const user = await this.UserService.findOne(id);
    return { ...user, Password: undefined };
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Update user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(new OrGuard([new AdminGuard(), new CheckUserId(['params', 'id'])]))
  @Put('/:id')
  @UseInterceptors(NotFoundInterceptor)
  async update(
    @Param('id') id: number,
    @Body() userDto: UpdateUserDto,
  ): Promise<void> {
    const user = await this.UserService.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    if (userDto.Firstname) user.Firstname = userDto.Firstname;
    if (userDto.Lastname) user.Lastname = userDto.Lastname;

    await this.UserService.update(id, user);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Delete user' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(new OrGuard([new AdminGuard(), new CheckUserId(['params', 'id'])]))
  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    const existingUser = await this.UserService.isExistingUser(id);
    if (existingUser) {
      return await this.UserService.remove(id);
    } else {
      throw new BadRequestException('All the keys are required');
    }
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'Create user' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @UseGuards(AdminGuard)
  @Post()
  async createUser(@Body() userDto: CreateUserDto): Promise<number> {
    const user = new User();
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const regexPassword =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{12,}$/g;

    // check if all the keys are present
    if (
      !userDto.Firstname == undefined ||
      !userDto.Lastname == undefined ||
      !userDto.Username == undefined ||
      !userDto.Email == undefined ||
      !userDto.Password == undefined ||
      !userDto.SuperAdmin == undefined ||
      !userDto.RoleName == undefined
    ) {
      throw new BadRequestException('All the keys are required');
    }

    const salt = await bcryptjs.genSalt();
    const hash = await bcryptjs.hash(userDto.Password, salt);

    if (regexEmail.test(userDto.Email) === false)
      throw new BadRequestException('Email is not valid');

    if (regexPassword.test(userDto.Password) === false)
      throw new BadRequestException('Password is not valid');

    const existingUser = await this.UserService.findByUsernameOrEmail(
      userDto.Username,
      userDto.Email,
    );

    if (existingUser) {
      throw new ConflictException('User with this username already exists');
    }

    user.Firstname = userDto.Firstname;
    user.Lastname = userDto.Lastname;
    user.Username = userDto.Username;
    user.Password = hash;
    user.Email = userDto.Email;
    user.SuperAdmin = userDto.SuperAdmin;
    user.RoleName = userDto.RoleName;

    try {
      return await this.UserService.create(user);
    } catch (error) {
      throw new HttpException('Role not found', 400);
    }
  }
}
