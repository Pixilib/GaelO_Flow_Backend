import { Module } from '@nestjs/common';
import { OrthancAdminController } from './orthanc-admin.controller';
import { OrthancController } from './orthanc.controller';
import { OrthancDeleteController } from './orthanc-delete.controller';
import { OrthancExportController } from './orthanc-export.controller';
import { OrthancImportController } from './orthanc-import.controller';
import { OrthancModifyController } from './orthanc-modify.controller';
import { OrthancQueryController } from './orthanc-query.controller';
import OrthancClient from '../utils/orthanc-client';
import { RolesModule } from '../roles/roles.module';
import { OrthancReadAllController } from './orthanc-read-all.controller';

@Module({
  imports: [RolesModule],
  providers: [OrthancClient],
  controllers: [
    OrthancController,
    OrthancAdminController,
    OrthancDeleteController,
    OrthancExportController,
    OrthancImportController,
    OrthancModifyController,
    OrthancQueryController,
    OrthancReadAllController,
  ],
})
export class OrthancModule {}
