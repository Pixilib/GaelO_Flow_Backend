import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  ConflictException,
  HttpException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Public } from '../interceptors/Public';
import { RegisterDto } from './register.dto';
import { ChangePasswordDto } from './changePassword.dto';

@Public()
@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

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

  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const {token, newPassword} = changePasswordDto;

    const userID = this.authService.verifyToken(token);
    if (!userID) throw new UnauthorizedException('Invalid token');


    await this.authService.changePassword(userId, newPassword)
  }
 
}
