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
  UsePipes,
  ValidationPipe,
  ValidationError,
} from '@nestjs/common';
import { ApiBody, ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from '../guards/local.guard';
import { JwtOAuthGuard } from '../guards/jwt-oauth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Public } from '../interceptors/public';
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
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Request) {
    return await this.authService.login(req['user']);
  }

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
        Username: userData.username,
        SuperAdmin: false,
        RoleName: 'User',
        Password: null,
      });
    }

    const user = await this.usersService.findOneByEmail(userData.email);
    return await this.authService.login(user);
  }

  @ApiResponse({ status: 201, description: 'Register success' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const userExists = await this.usersService.findOneByEmail(
      registerDto.Email,
      false,
    );

    if (userExists) {
      throw new ConflictException(
        'A user already exist with this username or email',
      );
    }

    const newUser = await this.usersService.create({
      Email: registerDto.Email,
      Firstname: registerDto.Firstname,
      Lastname: registerDto.Lastname,
      Username: registerDto.Username,
      SuperAdmin: false,
      RoleName: 'User',
      Password: null,
    });
    const confirmationToken =
      await this.authService.createConfirmationToken(newUser);

    await this.mailService.sendChangePasswordEmail(
      newUser.Email,
      confirmationToken,
    );
  }

  @ApiResponse({ status: 201, description: 'Password changed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: ChangePasswordDto })
  @Public()
  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) =>
          Object.values(error.constraints).join(', '),
        );
        return new BadRequestException(messages);
      },
    }),
  )
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<undefined> {
    const { Token, NewPassword, ConfirmationPassword } = changePasswordDto;

    if (NewPassword !== ConfirmationPassword) {
      throw new BadRequestException('Confirmation password not matching');
    }

    const userId = await this.authService.verifyToken(Token);
    if (!userId) {
      throw new BadRequestException('Invalid token');
    }
    await this.usersService.updateUserPassword(userId, NewPassword);
  }

  @ApiResponse({ status: 200, description: 'Email sent' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Public()
  @Post('lost-password')
  async lostPassword(@Body() body: { Email: string }) {
    const { Email } = body;
    const user = await this.usersService.findOneByEmail(Email, false);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const token = await this.authService.createConfirmationToken(user);
    await this.mailService.sendChangePasswordEmail(user.Email, token);
  }
}
