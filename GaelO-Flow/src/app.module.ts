import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// MAIN ROUTE
import { AppController } from './app.controller';

// USER ROUTE
import { User } from './users/user.entity';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';

// ROLE ROUTE
import { Role } from './roles/role.entity';
import { RolesService } from './roles/roles.service';
import { RolesController } from './roles/roles.controller';

// OPTION ROUTE
import { Option } from './options/option.entity';
import { OptionsService } from './options/options.service';
import { OptionsController } from './options/options.controller';

// LABEL ROUTE
import { Label } from './labels/label.entity';
import { LabelsController } from './labels/labels.controller';
import { LabelsService } from './labels/labels.service';

// AUTH ROUTE
import { AuthModule } from './auth/auth.module';

import { OrthancController } from './orthanc/orthanc.controller';
import { OrthancDeleteController } from './orthanc/orthanc-delete.controller';
import { OrthancExportController } from './orthanc/orthanc-export.controller';
import { OrthancImportController } from './orthanc/orthanc-import.controller';
import { OrthancModifyController } from './orthanc/orthanc-modify.controller';
import { OrthancQueryController } from './orthanc/orthanc-query.controller';
import { OrthancAdminController } from './orthanc/orthanc-admin.controller';

import OrthancClient from './utils/orthanc-client';

// QUEUES
import { QueuesDeleteController } from './queues/delete/queue-deletes.controller';
import { QueuesDeleteService } from './queues/delete/queue-deletes.service';

import { QueuesAnonController } from './queues/anon/queue-anons.controller';
import { QueuesAnonService } from './queues/anon/queue-anons.service';

import { QueuesQueryController } from './queues/query/queue-query.controller';
import { QueuesQueryService } from './queues/query/queue-query.service';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';

// // ROLE LABEL ROUTE
// import { RoleLabel } from './role-label/role-label.entity';
// import { RoleLabelModule } from './role-label/role-label.module';

import { SeedService } from './seeder.service';
import { MailService } from './mail/mail.service';

import { MailModule } from './mail/mail.module';

// OAUTHCONFIG ROUTE
import { OauthConfigController } from './oauth-configs/oauth-configs.controller';
import { OauthConfigService } from './oauth-configs/oauth-configs.service';
import { OauthConfigModule } from './oauth-configs/oauth-configs.module';
import { OauthConfig } from './oauth-configs/oauth-config.entity';

// PROCESSING
import ProcessingClient from './utils/processing.client';
import { ProcessingController } from './processing/processing.controller';
import { TmtvService } from './processing/tmtv.service';
import { ProcessingQueueService } from './processing/processing-queue.service';

import { HttpModule } from '@nestjs/axios';
import { logger } from './utils/logger.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NotFoundInterceptor } from './interceptors/not-found.interceptor';

import { Autorouting } from './autorouting/autorouting.entity';
import { AutoroutingsController } from './autorouting/autoroutings.controller';
import { AutoroutingsService } from './autorouting/autoroutings.service';
import { AutoroutingsModule } from './autorouting/autoroutings.module';

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
        entities: [User, Role, Option, Label, OauthConfig, Autorouting],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      Role,
      Option,
      Label,
      OauthConfig,
      Autorouting,
    ]),
    AuthModule,
    TasksModule,
    MailModule,
    OauthConfigModule,
    HttpModule,
    AutoroutingsModule,
  ],
  controllers: [
    AppController,
    UsersController,
    RolesController,
    OptionsController,
    LabelsController,
    OrthancController,
    OrthancDeleteController,
    OrthancExportController,
    OrthancImportController,
    OrthancModifyController,
    OrthancQueryController,
    OrthancAdminController,
    QueuesDeleteController,
    QueuesAnonController,
    QueuesQueryController,
    OauthConfigController,
    ProcessingController,
    AutoroutingsController,
  ],
  providers: [
    SeedService,
    RolesService,
    UsersService,
    OptionsService,
    LabelsService,
    OrthancClient,
    QueuesDeleteService,
    QueuesAnonService,
    QueuesQueryService,
    MailService,
    OauthConfigService,
    ProcessingClient,
    TmtvService,
    ProcessingQueueService,
    AutoroutingsService,
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
