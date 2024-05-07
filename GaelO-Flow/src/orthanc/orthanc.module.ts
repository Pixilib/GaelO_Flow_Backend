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
import { DicomWebGuard } from '../guards/dicom-web.guard';
import { StudyGuard } from '../guards/study.guard';
import { SeriesGuard } from '../guards/series.guard';

@Module({
  imports: [RolesModule],
  providers: [OrthancClient, DicomWebGuard, StudyGuard, SeriesGuard],
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
