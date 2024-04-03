import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';
import { OauthConfig } from '../oauth_configs/oauth_config.entity';
import { HttpModule, HttpService } from '@nestjs/axios';
import { JwtOauthStrategy } from './jwt-oauth.strategy';
import { OauthConfigService } from '../oauth_configs/oauth_configs.service';

@Module({
  imports: [
    UsersModule,
    HttpModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): any => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '6h' },
      }),
    }),
    TypeOrmModule.forFeature([User, OauthConfig]),
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    JwtOauthStrategy,
    AuthService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    MailService,
    OauthConfigService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
