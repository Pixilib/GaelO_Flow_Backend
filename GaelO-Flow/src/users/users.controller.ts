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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserDto } from './users.dto';
import * as bcrypt from 'bcrypt';
import { NotFoundInterceptor } from '../interceptors/NotFoundInterceptor';

@Controller('/users')
export class UsersController {
  constructor(private readonly UserService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.UserService.findAll();
  }

  @Get('/:id')
  @UseInterceptors(NotFoundInterceptor)
  async getUsersId(@Param('id') id: number): Promise<User> {
      const user = await this.UserService.findOne(id);
      return user;
  }

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
    if (userDto.super_admin) user.super_admin = userDto.super_admin;
    if (userDto.role_name) user.role_name = userDto.role_name;
    if (userDto.is_active) user.is_active = userDto.is_active;

    await this.UserService.update(id, user);
  }

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
      userDto.firstname    == undefined ||
      !userDto.lastname    == undefined ||
      !userDto.username    == undefined ||
      !userDto.email       == undefined ||
      !userDto.password    == undefined ||
      !userDto.super_admin == undefined ||
      !userDto.role_name   == undefined ||
      !userDto.is_active   == undefined
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
    user.super_admin = userDto.super_admin;
    user.is_active = userDto.is_active;
    user.role_name = userDto.role_name;
    user.salt = salt;

    try {
      return await this.UserService.create(user);
    } catch (error) {
      throw new HttpException('Role not found', 400);
    }
  }
}
