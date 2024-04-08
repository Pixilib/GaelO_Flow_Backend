import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  HttpException,
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
import { NotFoundInterceptor } from '../interceptors/not-found.interceptor';
import { AdminGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrGuard } from '../guards/or.guard';
import { CheckUserIdGuard } from '../guards/check-user-id.guard';

@ApiTags('users')
@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: [GetUserDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminGuard)
  @Get()
  async getUsers(): Promise<GetUserDto[]> {
    const allUsers = await this.userService.findAll();
    return allUsers.map((user) => {
      return {
        Id: user.Id,
        Firstname: user.Firstname,
        Lastname: user.Lastname,
        Username: user.Username,
        Email: user.Email,
        SuperAdmin: user.SuperAdmin,
        RoleName: user.RoleName,
      };
    });
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Get user by id', type: GetUserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(
    new OrGuard([new AdminGuard(), new CheckUserIdGuard(['params', 'id'])]),
  )
  @Get('/:id')
  async getUsersId(@Param('id') id: number): Promise<GetUserDto> {
<<<<<<< Updated upstream
    const user = await this.UserService.findOne(id);
    console.log(user);
    return { ...user, Password: undefined };
=======
    const user = await this.userService.findOne(id);
    return {
      Id: user.Id,
      Firstname: user.Firstname,
      Lastname: user.Lastname,
      Username: user.Username,
      Email: user.Email,
      SuperAdmin: user.SuperAdmin,
      RoleName: user.RoleName,
    };
>>>>>>> Stashed changes
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Update user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(
    new OrGuard([new AdminGuard(), new CheckUserIdGuard(['params', 'id'])]),
  )
  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() userDto: UpdateUserDto,
  ): Promise<void> {
    const user = await this.userService.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    if (userDto.Firstname) user.Firstname = userDto.Firstname;
    if (userDto.Lastname) user.Lastname = userDto.Lastname;

    await this.userService.update(id, user);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Delete user' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(
    new OrGuard([new AdminGuard(), new CheckUserIdGuard(['params', 'id'])]),
  )
  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    const existingUser = await this.userService.isExistingUser(id);
    if (existingUser) {
      return await this.userService.remove(id);
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
    const existingUser = await this.userService.findByUsernameOrEmail(
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
      return await this.userService.create(user);
    } catch (error) {
      throw new HttpException('Role not found', 400);
    }
  }
}
