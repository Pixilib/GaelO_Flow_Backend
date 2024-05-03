import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { logger } from './utils/logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NotFoundInterceptor } from './interceptors/not-found.interceptor';

import ProcessingClient from './utils/processing.client';

// MODULES
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './mail/mail.module';
import { OauthConfigModule } from './oauth-configs/oauth-configs.module';
import { HttpModule } from '@nestjs/axios';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AutoroutingsModule } from './autorouting/autoroutings.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { LabelsModule } from './labels/labels.module';
import { OptionsModule } from './options/options.module';
import { OrthancModule } from './orthanc/orthanc.module';
import { ProcessingModule } from './processing/processing.module';
import { QueueModule } from './queues/queue.module';

// CONTROLLERS
import { AppController } from './app.controller';

// ENTITIES
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
import { Option } from './options/option.entity';
import { Label } from './labels/label.entity';
import { OauthConfig } from './oauth-configs/oauth-config.entity';
import { Autorouting } from './autorouting/autorouting.entity';

// SERVICES
import { UsersService } from './users/users.service';
import { RolesService } from './roles/roles.service';
import { OptionsService } from './options/options.service';
import { MailService } from './mail/mail.service';
import { OauthConfigService } from './oauth-configs/oauth-configs.service';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>(
          'TYPEORM_TYPE',
          'postgres',
        ) as 'postgres', // Default to 'postgres'
        host: configService.get<string>('TYPEORM_HOST', 'localhost'),
        port: +configService.get<number>('TYPEORM_PORT', 5432),
        username: configService.get<string>('TYPEORM_USERNAME', 'postgres'),
        password: configService.get<string>('TYPEORM_PASSWORD', 'postgres'),
        database: configService.get<string>('TYPEORM_DATABASE', 'gaelo-flow'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    LabelsModule,
    OptionsModule,
    TasksModule,
    OauthConfigModule,
    ProcessingModule,
    AutoroutingsModule,
    QueueModule,
    OrthancModule,
    MailModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [
    ProcessingClient,
    {
      provide: APP_INTERCEPTOR,
      useClass: NotFoundInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
