import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  ConflictException,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './register-dto';
import * as bcrypt from 'bcrypt';
import { Public } from '../interceptors/Public';

@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    const user = await this.usersService.findOneByUsername(
      signInDto.username,
      true,
    );
    if (!user) throw new UnauthorizedException();
    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException();
    return this.authService.signIn(user);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(registerDto);
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw error; // Relève les autres erreurs inattendues
    }
  }
  // @Post('register')
  // async register(@Body() RegisterDto: Record<string,any>) {
  //   const user = await this.usersService.findOneByUsername(RegisterDto.username, true);
  //   if (user)
  //     throw new UnauthorizedException();
  // }else {
  //   const newUser = await this.usersService.create(RegisterDto.password, RegisterDto.username, RegisterDto.email, RegisterDto.firstname, RegisterDto.lastname);

  // }

  //create a api route to register a user without a role or password just username and email
}
