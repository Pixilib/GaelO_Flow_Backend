import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOAuth2,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { LocalAuthGuard } from '../guards/local.guard';
import { JwtOAuthGuard } from '../guards/jwt-oauth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Public } from '../interceptors/public';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LostPassworDto } from './dto/lost-password.dto';

/**
 * Controller for all authentication related APIs
 */
@ApiTags('auth')
@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  /**
   * login controller
   */
  @ApiResponse({ status: 200, description: 'Login success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: LoginDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Request) {
    return await this.authService.login(req['user']);
  }

  /**
   * OAuth2 login controller
   */
  @ApiOperation({
    description:
      'Send a oauth2 JWT token as bearer in the headers, the controller will validate / deny it',
  })
  @ApiResponse({ status: 200, description: 'Login success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOAuth2(['openid'], 'oauth2')
  @Public()
  @UseGuards(JwtOAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('oauth2')
  async oauth2Login(@Request() req: Request) {
    const userData = req['user'];

    if (!userData || !userData.email) {
      throw new UnauthorizedException('Invalid token');
    }

    const userExists = await this.usersService.findOneByEmail(userData.email);
    if (!userExists) {
      await this.usersService.create({
        Email: userData.email,
        Firstname: userData.firstname,
        Lastname: userData.lastname,
        RoleName: 'User',
        Password: null,
      });
    }

    const user = await this.usersService.findOneByEmail(userData.email);
    return await this.authService.login(user);
  }

  @ApiResponse({ status: 201, description: 'Register success' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiBody({ type: RegisterDto })
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const userExists = await this.usersService.findOneByEmail(
      registerDto.Email,
      false,
    );
    if (userExists) {
      throw new ConflictException('A user already exist with this email');
    }

    const newUser = await this.usersService.create({
      Email: registerDto.Email,
      Firstname: registerDto.Firstname,
      Lastname: registerDto.Lastname,
      RoleName: 'User',
      Password: null,
    });
    const confirmationToken =
      await this.authService.createConfirmationToken(newUser);

    await this.mailService.sendChangePasswordEmail(
      newUser.Email,
      confirmationToken,
      newUser.Id,
    );
  }

  @ApiResponse({ status: 201, description: 'Password changed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: ChangePasswordDto })
  @Public()
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { Token, NewPassword, ConfirmationPassword, UserId } =
      changePasswordDto;

    if (NewPassword !== ConfirmationPassword) {
      throw new BadRequestException('Confirmation password does not match');
    }
    await this.usersService.findOne(UserId);
    await this.authService.verifyConfirmationToken(Token, UserId);
    await this.usersService.updateUserPassword(UserId, NewPassword);
  }

  @ApiResponse({ status: 200, description: 'Email sent' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: LostPassworDto })
  @Public()
  @Post('lost-password')
  async lostPassword(@Body() body: LostPassworDto) {
    const { Email } = body;
    const user = await this.usersService.findOneByEmail(Email, false);
    const token = await this.authService.createConfirmationToken(user);
    await this.mailService.sendChangePasswordEmail(user.Email, token, user.Id);
  }
}
