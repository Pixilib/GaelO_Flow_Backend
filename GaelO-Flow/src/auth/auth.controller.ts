import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Req,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcryptjs from 'bcryptjs';
import { Public } from '../interceptors/Public';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';

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
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return await this.authService.login(user);
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
      roleName: 'User',
      password: null,
    });

    const newUser = await this.usersService.findOneByEmail(email, false);

    //generate a token for confirmation of user:
    const confirmationToken =
      await this.authService.createConfirmationToken(newUser);

    await this.mailService.sendChangePasswordEmail(
      newUser.email,
      confirmationToken,
    );
  }

  @ApiResponse({ status: 201, description: 'Password changed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiBearerAuth('access-token')
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ): Promise<undefined> {
    const { newPassword, confirmationPassword } = changePasswordDto;
    const userId = req['user'].userId;
    if (newPassword !== confirmationPassword) {
      throw new BadRequestException('Confirmation password not matching');
    }

    const user = await this.usersService.findOne(userId);

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;

    await this.usersService.update(userId, user);
  }
}
