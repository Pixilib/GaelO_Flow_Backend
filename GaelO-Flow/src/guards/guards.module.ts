import { Module, Query } from '@nestjs/common';
import { CheckLabelInRole } from './check-label-in-role.guard';
import { CheckUserIdParamsGuard } from './check-user-id-params.guard';
import { CheckUserRoleGuard } from './check-user-role.guard';
import { DicomWebGuard } from './dicom-web.guard';
import { InstanceGuard } from './instance.guard';
import { JwtOAuthGuard } from './jwt-oauth.guard';
import { JwtAuthGuard } from './jwt.guard';
import { LocalAuthGuard } from './local.guard';
import {
  AdminGuard,
  AnonymizeGuard,
  AutoQueryGuard,
  AutoRoutingGuard,
  CdBurnerGuard,
  DeleteGuard,
  ExportGuard,
  ImportGuard,
  ModifyGuard,
  QueryGuard,
  ReadAllGuard,
} from './roles.guard';
import { SeriesGuard } from './series.guard';
import { StudyGuard } from './study.guard';
import { RolesModule } from 'src/roles/roles.module';
import OrthancClient from 'src/utils/orthanc-client';

@Module({
  imports: [RolesModule],
  providers: [
    OrthancClient,
    CheckLabelInRole,
    CheckUserIdParamsGuard,
    CheckUserRoleGuard,
    DicomWebGuard,
    InstanceGuard,
    JwtOAuthGuard,
    JwtAuthGuard,
    LocalAuthGuard,
    ImportGuard,
    AnonymizeGuard,
    ExportGuard,
    QueryGuard,
    AutoQueryGuard,
    DeleteGuard,
    AdminGuard,
    ModifyGuard,
    CdBurnerGuard,
    AutoRoutingGuard,
    ReadAllGuard,
    SeriesGuard,
    StudyGuard,
  ],
  controllers: [],
})
export class GuardsModule {}
