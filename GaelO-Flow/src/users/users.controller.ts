import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserDto } from './users.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/role.entity';

@Controller('/users')
export class UsersController {
  constructor(private readonly UserService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    console.log(await this.UserService.findAll());
    return await this.UserService.findAll();
  }

  @Get('/:id')
  async getUsersId(@Param('id') id: number): Promise<User> {
    return await this.UserService.findOne(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() userDto: UserDto,
  ): Promise<void> {
    // return await this.UserService.update(id, body);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.UserService.remove(id);
  }

  @Post()
  async createUser(@Body() userDto: UserDto): Promise<number> {
    const role = new Role();
    const user = new User();
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const regexPassword =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{12,}$/g;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(userDto.password, salt);

    // const isMatch = await bcrypt.compare(userDto.password, hash);

    role.name = userDto.role_name;

    if (regexEmail.test(userDto.email) === false)
      throw new HttpException('Email is not valid', 400);

    if (regexPassword.test(userDto.password) === false)
      throw new HttpException('Password is not valid', 400);

    user.firstname = userDto.firstname;
    user.lastname = userDto.lastname;
    user.username = userDto.username;
    user.password = hash;
    user.email = userDto.email;
    user.super_admin = userDto.super_admin;
    user.is_active = userDto.is_active;
    user.role_name = userDto.role_name;
    user.salt = salt;

    const existingUser = await this.UserService.findByUsernameOrEmail(userDto.username, userDto.email);

    if (existingUser) {
      throw new HttpException('User with this username or email already exists', 409)
    }

    return await this.UserService.create(user);
  }
}
