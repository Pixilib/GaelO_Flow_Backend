import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';

import { AuthController } from './auth.controller';
import { User } from '../users/user.entity';

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { OauthConfig } from '../oauth-configs/oauth-config.entity';
import { JwtOauthStrategy } from './jwt-oauth.strategy';
import { OauthConfigService } from '../oauth-configs/oauth-configs.service';

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
