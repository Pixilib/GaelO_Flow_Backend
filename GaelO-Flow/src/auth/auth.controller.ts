import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcryptjs from 'bcryptjs';
import { Public } from '../interceptors/Public';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './login.dto';
import { ChangePasswordDto } from './changePassword.dto';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './register.dto';
@ApiTags('auth')
@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  @ApiResponse({ status: 200, description: 'Login success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: LoginDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    const user = await this.usersService.findOneByUsername(
      signInDto.username,
      true,
    );
    if (!user) throw new UnauthorizedException();
    const isMatch = await bcryptjs.compare(signInDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException();
    return this.authService.signIn(user);
  }

  @ApiResponse({ status: 201, description: 'Register success' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { email } = registerDto;

    // Check if user already exists
    const userExists = await this.usersService.findOneByEmail(email, false);

    if (userExists) {
      throw new ConflictException(
        'A user already exist with this username or email',
      );
    }

    await this.usersService.create({
      ...registerDto,
      superAdmin: false,
      salt: null,
      roleName: 'User',
      password: null,
    });

    const newUser = await this.usersService.findOneByEmail(email, false);

    //generate a token for confirmation of user:
    const confirmationToken =
      await this.authService.createConfirmationToken(newUser);
    
    console.table({confirmationToken,newUser})

    await this.mailService.sendChangePasswordEmail(
      newUser.email,
      confirmationToken,
    );

    return {
      status: HttpStatus.CREATED,
      message: 'An email has been sent, confirm your account to login',
    };
  }

  @Post('change-password')
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { token, newPassword, confirmationPassword } = changePasswordDto;

    if (newPassword !== confirmationPassword) {
      throw new BadRequestException('Confirmation password not matching');
    }

    const userID = await this.authService.verifyToken(token);
    if (!userID) throw new BadRequestException('Invalid token');

    const user = await this.usersService.findOne(userId);

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;
    user.salt = salt;

    await this.usersService.update(userId, user);

    return {
      status: HttpStatus.CREATED,
    };
  }
}
