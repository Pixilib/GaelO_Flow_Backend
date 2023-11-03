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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserDto } from './users.dto';
import * as bcrypt from 'bcrypt';
import { NotFoundInterceptor } from '../interceptors/NotFoundInterceptor';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('/users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly UserService: UsersService) {}
  
  @Roles(['Admin'])
  @Get()
  async getUsers(): Promise<User[]> {
    return await this.UserService.findAll();
  }

  @Roles(['Admin'])
  @Get('/:id')
  @UseInterceptors(NotFoundInterceptor)
  async getUsersId(@Param('id') id: number): Promise<User> {
    const user = await this.UserService.findOne(id);
    return user;
  }

  @Roles(['Admin'])
  @Put('/:id')
  @UseInterceptors(NotFoundInterceptor)
  async update(
    @Param('id') id: number,
    @Body() userDto: UserDto,
  ): Promise<void> {
    const user = await this.UserService.findOne(id);
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const regexPassword =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{12,}$/g;

    if (userDto.firstname) user.firstname = userDto.firstname;
    if (userDto.lastname) user.lastname = userDto.lastname;
    if (userDto.username) user.username = userDto.username;
    if (userDto.password) {
      if (regexPassword.test(userDto.password) === false)
        throw new HttpException('Password is not valid', 400);
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(userDto.password, salt);
      user.password = hash;
      user.salt = salt;
    }
    if (userDto.email) {
      if (regexEmail.test(userDto.email) === false)
        throw new HttpException('Email is not valid', 400);
      user.email = userDto.email;
    }
    if (userDto.superAdmin) user.superAdmin = userDto.superAdmin;
    if (userDto.roleName) user.roleName = userDto.roleName;
    if (userDto.isActive) user.isActive = userDto.isActive;

    await this.UserService.update(id, user);
  }

  @Roles(['Admin'])
  @Delete('/:id')
  @UseInterceptors(NotFoundInterceptor)
  async delete(@Param('id') id: number): Promise<void> {
    const user = await this.UserService.findOne(id);
    return await this.UserService.remove(id);
  }

  @Post()
  async createUser(@Body() userDto: UserDto): Promise<number> {
    const user = new User();
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const regexPassword =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{12,}$/g;

    // check if all the keys are present
    if (
      userDto.firstname == undefined ||
      !userDto.lastname == undefined ||
      !userDto.username == undefined ||
      !userDto.email == undefined ||
      !userDto.password == undefined ||
      !userDto.superAdmin == undefined ||
      !userDto.roleName == undefined ||
      !userDto.isActive == undefined
    )
      throw new HttpException('All the keys are required', 400);

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(userDto.password, salt);

    if (regexEmail.test(userDto.email) === false)
      throw new HttpException('Email is not valid', 400);

    if (regexPassword.test(userDto.password) === false)
      throw new HttpException('Password is not valid', 400);

    const existingUser = await this.UserService.findByUsernameOrEmail(
      userDto.username,
      userDto.email,
    );

    if (existingUser) {
      throw new HttpException(
        'User with this username or email already exists',
        409,
      );
    }

    user.firstname = userDto.firstname;
    user.lastname = userDto.lastname;
    user.username = userDto.username;
    user.password = hash;
    user.email = userDto.email;
    user.superAdmin = userDto.superAdmin;
    user.isActive = userDto.isActive;
    user.roleName = userDto.roleName;
    user.salt = salt;

    try {
      return await this.UserService.create(user);
    } catch (error) {
      throw new HttpException('Role not found', 400);
    }
  }
}
