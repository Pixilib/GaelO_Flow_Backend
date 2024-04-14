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
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrGuard } from '../guards/or.guard';
import { CheckUserIdGuard } from '../guards/check-user-id.guard';
import { GetUserDto } from './dto/get-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { hashPassword } from '../utils/passwords';

@ApiTags('users')
@Controller('/users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly roleService: RolesService,
  ) {}

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
        Role: user.Role,
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
    const user = await this.userService.findOne(id);
    return {
      Id: user.Id,
      Firstname: user.Firstname,
      Lastname: user.Lastname,
      Username: user.Username,
      Email: user.Email,
      SuperAdmin: user.SuperAdmin,
      RoleName: user.RoleName,
      Role: user.Role,
    };
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

    if (!existingUser) throw new NotFoundException('User not found');
    return await this.userService.remove(id);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'Create user' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @UseGuards(AdminGuard)
  @Post()
  async createUser(@Body() userDto: CreateUserDto): Promise<number> {
    let user = new User();
    const existingUser = await this.userService.findByUsernameOrEmail(
      userDto.Username,
      userDto.Email,
    );
    const role = await this.roleService.isRoleExist(userDto.RoleName);

    if (!role) {
      throw new BadRequestException('Role not found');
    }
    if (existingUser) {
      throw new ConflictException('Username / Email already used');
    }
    user = { ...userDto, Password: await hashPassword(userDto.Password) };
    return (await this.userService.create(user)).Id;
  }
}
