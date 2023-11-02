import { Body, Controller, Post, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Public } from '../interceptors/Public';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    const user = await this.usersService.findOneByUsername(signInDto.username, true);
    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch)
      throw new UnauthorizedException();
    return this.authService.signIn(user);
  }
}
