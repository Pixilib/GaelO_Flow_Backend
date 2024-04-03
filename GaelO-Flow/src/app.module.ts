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

import { OrthancController } from './orthanc/Orthanc.controller';
import { OrthancDeleteController } from './orthanc/OrthancDelete.controller';
import { OrthancExportController } from './orthanc/OrthancExport.controller';
import { OrthancImportController } from './orthanc/OrthancImport.controller';
import { OrthancModifyController } from './orthanc/OrthancModify.controller';
import { OrthancQueryController } from './orthanc/OrthancQuery.controller';
import { OrthancAdminController } from './orthanc/OrthancAdmin.controller';

import OrthancClient from './orthanc/OrthancClient';

// QUEUES
import { QueuesDeleteController } from './queues/delete/queueDeletes.controller';
import { QueuesDeleteService } from './queues/delete/queueDeletes.service';

import { QueuesAnonController } from './queues/anon/queueAnons.controller';
import { QueuesAnonService } from './queues/anon/queueAnons.service';

import { QueuesQueryController } from './queues/query/queueQuery.controller';
import { QueuesQueryService } from './queues/query/queueQuery.service';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';

// ROLE LABEL ROUTE
import { RoleLabel } from './role_label/role_label.entity';
import { RoleLabelModule } from './role_label/role_label.module';

import { SeedService } from './seeder.service';
import { MailService } from './mail/mail.service';

import { MailModule } from './mail/mail.module';

// OAUTHCONFIG ROUTE
import { OauthConfigController } from './oauth_configs/oauth_configs.controller';
import { OauthConfigService } from './oauth_configs/oauth_configs.service';
import { OauthConfigModule } from './oauth_configs/oauth_configs.module';
import { OauthConfig } from './oauth_configs/oauth_config.entity';

// PROCESSING
import ProcessingClient from './processing/ProcessingClient';
import { ProcessingController } from './processing/processing.controller';

import { HttpModule } from '@nestjs/axios';
import { logger } from './utils/logger.middleware';
import { TmtvService } from './processing/tmtv.service';
import { ProcessingQueueService } from './processing/processingQueue.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
        entities: [User, Role, Option, Label, RoleLabel, OauthConfig],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      Role,
      Option,
      Label,
      RoleLabel,
      OauthConfig,
    ]),
    AuthModule,
    TasksModule,
    MailModule,
    RoleLabelModule,
    OauthConfigModule,
    HttpModule,
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
