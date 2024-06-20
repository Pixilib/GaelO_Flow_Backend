import { Delete, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import * as OrthancUtils from '../src/orthanc/utils';

import { AppModule } from '../src/app.module';
import { Autorouting } from '../src/autorouting/autorouting.entity';
import { createCustomJwt, loginAsAdmin } from './login';

jest.mock('../src/orthanc/utils.ts', () => ({
  doReverseProxy: jest
    .fn()
    .mockImplementation(async (request, response, orthancClient) => {
      return response.status(200).send();
    }),
}));

describe('Orthanc (e2e)', () => {
  let app: INestApplication;
  let server: any = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    server = app.getHttpServer();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await server.close();
  });

  describe('Orthanc-Base', () => {
    // CAN'T TEST GUARDS: StudyGuard; SeriesGuard; InstanceGuard; DicomWebGuard
    describe('CHECKLABELINROLE', () => {
      let adminToken: string;
      let token: string;
      let id: number;

      beforeAll(async () => {
        adminToken = (await loginAsAdmin(server)).AccessToken;

        await request(server)
          .post('/labels')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ Name: 'CHECKLABELINROLE_label' })
          .expect(201);

        await request(server)
          .post('/labels')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ Name: 'CHECKLABELINROLE_label_unused' })
          .expect(201);

        await request(server)
          .post('/roles')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            Name: 'noPermissionsRole',
            Import: false,
            Anonymize: false,
            Export: false,
            Query: false,
            AutoQuery: false,
            Delete: false,
            Admin: false,
            Modify: false,
            CdBurner: false,
            AutoRouting: false,
            ReadAll: false,
          })
          .expect(201);

        await request(server)
          .post('/roles/noPermissionsRole/labels')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ Name: 'CHECKLABELINROLE_label' })
          .expect(201);

        await request(server)
          .post('/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            Firstname: 'noPermissionsUser',
            Lastname: 'noPermissionsUser',
            Email: 'nopermissionsuser@test.com',
            Password: 'MyS3cretPa5sw0rd!',
            RoleName: 'noPermissionsRole',
          })
          .expect(201);

        const response = await request(server)
          .post('/login')
          .send({
            Email: 'nopermissionsuser@test.com',
            Password: 'MyS3cretPa5sw0rd!',
          })
          .expect(200);
        token = response.body.AccessToken;
        id = response.body.UserId;
      });

      afterAll(async () => {
        await request(server)
          .delete(`/users/${id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        await request(server)
          .delete('/roles/noPermissionsRole/label/CHECKLABELINROLE_label')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        await request(server)
          .delete('/roles/noPermissionsRole')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        await request(server)
          .delete('/labels/CHECKLABELINROLE_label')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        await request(server)
          .delete('/labels/CHECKLABELINROLE_label_unused')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);
      });

      it('GET /labels/:labelName/studies', async () => {
        await request(server)
          .get('/labels/CHECKLABELINROLE_label/studies')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('GET /labels/*/studies', async () => {
        await request(server)
          .get('/labels/<NOT EXISTANT>/studies')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('GET /labels/*/studies', async () => {
        await request(server)
          .get('/labels/CHECKLABELINROLE_label_unused/studies')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });

    describe('READALL PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { ReadAll: true });
        console.log('ReadAll token:', token);
      });

      it('GET /series/*', async () => {
        await request(server)
          .get('/series/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('GET /instances/*', async () => {
        await request(server)
          .get('/instances/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('GET /dicom-web/*', async () => {
        await request(server)
          .get('/dicom-web/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });
    });

    describe('ADMIN PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Admin: true });
        console.log('Admin token:', token);
      });

      it('GET /modalities', async () => {
        await request(server)
          .get('/modalities')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });
    });

    describe('QUERY PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Query: true });
        console.log('Query token:', token);
      });

      it('GET /modalities', async () => {
        await request(server)
          .get('/modalities')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });
    });

    describe('AUTOQUERY PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { AutoQuery: true });
        console.log('AutoQuery token:', token);
      });

      it('GET /modalities', async () => {
        await request(server)
          .get('/modalities')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });
    });

    describe('EXPORT PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Export: true });
        console.log('Export token:', token);
      });

      it('GET /modalities', async () => {
        await request(server)
          .get('/modalities')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });
    });

    describe('NO PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, {});
        console.log('No permission token:', token);
      });

      it('GET /modalities', async () => {
        await request(server)
          .get('/modalities')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });
  });

  describe('Orthanc-Admin', () => {
    describe('ADMIN PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Admin: true });
        console.log('Admin token:', token);
      });

      it('GET /system', async () => {
        await request(server)
          .get('/system')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('POST /tools/reset', async () => {
        await request(server)
          .post('/tools/reset')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('POST /tools/shutdown', async () => {
        await request(server)
          .post('/tools/shutdown')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('GET /tools/log-level', async () => {
        await request(server)
          .get('/tools/log-level')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('PUT /tools/log-level', async () => {
        await request(server)
          .put('/tools/log-level')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('GET /plugins', async () => {
        await request(server)
          .get('/plugins')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('POST /jobs/*', async () => {
        await request(server)
          .post('/jobs/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('GET /jobs/:id?', async () => {
        await request(server)
          .get('/jobs/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('DELETE /modalities/*', async () => {
        await request(server)
          .delete('/modalities/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('POST /modalities/*/echo', async () => {
        await request(server)
          .post('/modalities/1/echo')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('PUT /modalities/*', async () => {
        await request(server)
          .put('/modalities/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('DELETE /peers/*', async () => {
        await request(server)
          .delete('/peers/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('GET /peers/*/system', async () => {
        await request(server)
          .get('/peers/1/system')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('PUT /peers/*/', async () => {
        await request(server)
          .put('/peers/1/')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });
    });

    describe('NOT ADMIN PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Admin: false });
        console.log('Not Admin token:', token);
      });

      it('GET /system', async () => {
        await request(server)
          .get('/system')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /tools/reset', async () => {
        await request(server)
          .post('/tools/reset')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /tools/shutdown', async () => {
        await request(server)
          .post('/tools/shutdown')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('GET /tools/log-level', async () => {
        await request(server)
          .get('/tools/log-level')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('PUT /tools/log-level', async () => {
        await request(server)
          .put('/tools/log-level')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('GET /plugins', async () => {
        await request(server)
          .get('/plugins')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /jobs/*', async () => {
        await request(server)
          .post('/jobs/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('GET /jobs/:id?', async () => {
        await request(server)
          .get('/jobs/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('DELETE /modalities/*', async () => {
        await request(server)
          .delete('/modalities/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /modalities/*/echo', async () => {
        await request(server)
          .post('/modalities/1/echo')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('PUT /modalities/*', async () => {
        await request(server)
          .put('/modalities/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('DELETE /peers/*', async () => {
        await request(server)
          .delete('/peers/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('GET /peers/*/system', async () => {
        await request(server)
          .get('/peers/1/system')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('PUT /peers/*/', async () => {
        await request(server)
          .put('/peers/1/')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });
  });

  describe('Orthanc-Delete', () => {
    describe('DELETE PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Delete: true });
        console.log('Delete token:', token);
      });

      it('DELETE /patients/*', async () => {
        await request(server)
          .delete('/patients/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('DELETE /studies/*', async () => {
        await request(server)
          .delete('/studies/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('DELETE /series/*', async () => {
        await request(server)
          .delete('/series/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });
    });

    describe('NOT DELETE PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Delete: false });
        console.log('Not Delete token:', token);
      });

      it('DELETE /patients/*', async () => {
        await request(server)
          .delete('/patients/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('DELETE /studies/*', async () => {
        await request(server)
          .delete('/studies/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('DELETE /series/*', async () => {
        await request(server)
          .delete('/series/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });
  });

  describe('Orthanc-Export', () => {
    describe('EXPORT PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Export: true });
        console.log('Export token:', token);
      });

      it('POST /modalities/*/store', async () => {
        await request(server)
          .post('/modalities/1/store')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('POST /tools/create-archive', async () => {
        await request(server)
          .post('/tools/create-archive')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('POST /tools/create-media', async () => {
        await request(server)
          .post('/tools/create-media')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('POST /tools/create-media-extended', async () => {
        await request(server)
          .post('/tools/create-media-extended')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('GET /peers*', async () => {
        await request(server)
          .get('/peers')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('POST /peers/*/store', async () => {
        await request(server)
          .post('/peers/1/store')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('POST /tasks/:user/export', async () => {
        await request(server)
          .post('/tasks/1/export')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });
    });

    describe('NOT EXPORT PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Export: false });
        console.log('Not Export token:', token);
      });

      it('POST /modalities/*/store', async () => {
        await request(server)
          .post('/modalities/1/store')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /tools/create-archive', async () => {
        await request(server)
          .post('/tools/create-archive')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /tools/create-media', async () => {
        await request(server)
          .post('/tools/create-media')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /tools/create-media-extended', async () => {
        await request(server)
          .post('/tools/create-media-extended')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('GET /peers*', async () => {
        await request(server)
          .get('/peers')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /peers/*/store', async () => {
        await request(server)
          .post('/peers/1/store')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /tasks/:user/export', async () => {
        await request(server)
          .post('/tasks/1/export')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });
  });

  describe('Orthanc-Import', () => {
    describe('IMPORT PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Import: true });
        console.log('Import token:', token);
      });

      it('POST /instances', async () => {
        await request(server)
          .post('/instances')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('POST /tools/create-dicom', async () => {
        await request(server)
          .post('/tools/create-dicom')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });
    });

    describe('NOT IMPORT PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Import: false });
        console.log('Not Import token:', token);
      });

      it('POST /instances', async () => {
        await request(server)
          .post('/instances')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /tools/create-dicom', async () => {
        await request(server)
          .post('/tools/create-dicom')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });
  });

  describe('Orthanc-Modify', () => {
    describe('MODIFY PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Modify: true });
        console.log('Modify token:', token);
      });

      it('POST /modalities/*/modify', async () => {
        await request(server)
          .post('/modalities/1/modify')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('POST /studies/*/modify', async () => {
        await request(server)
          .post('/studies/1/modify')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('POST /series/*/modify', async () => {
        await request(server)
          .post('/series/1/modify')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });
    });

    describe('NOT MODIFY PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Modify: false });
        console.log('Not Modify token:', token);
      });

      it('POST /modalities/*/modify', async () => {
        await request(server)
          .post('/modalities/1/modify')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /studies/*/modify', async () => {
        await request(server)
          .post('/studies/1/modify')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /series/*/modify', async () => {
        await request(server)
          .post('/series/1/modify')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });
  });

  describe('Orthanc-Query', () => {
    describe('QUERY PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Query: true });
        console.log('Query token:', token);
      });

      it('POST /modalities/*/query', async () => {
        await request(server)
          .post('/modalities/1/query')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('GET /queries/*/answers*', async () => {
        await request(server)
          .get('/queries/1/answers')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('POST /queries/:id/answers/:index/retrieve', async () => {
        await request(server)
          .post('/queries/1/answers/1/retrieve')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      // describe('POST /modalities/:id/parsed-query', () => { // TODO: Rebase & fix
      //   it('series', async () => {
      //     const response = await request(server)
      //       .post('/modalities/1/parsed-query')
      //       .set('Authorization', `Bearer ${token}`)
      //       .send({
      //         Level: 'series',
      //         Query: {
      //           StudyUID: 'study_uid',
      //           Modality: 'modality',
      //           ProtocolName: 'protocol_name',
      //           SeriesDescription: 'series_description',
      //           SeriesNumber: 'series_number',
      //           SeriesInstanceUID: 'series_instance_uid',
      //         },
      //       });

      //     console.log('LEVEL_SERIES:', response.body);
      //   });

      //   it('LEVEL_STUDY', async () => {
      //     const response = await request(server)
      //       .post('/modalities/1/parsed-query')
      //       .set('Authorization', `Bearer ${token}`)
      //       .send({
      //         Level: 'study',
      //         Query: {
      //           PatientName: 'patient_name',
      //           PatientID: 'patient_id',
      //           StudyDate: 'patient_birthdate',
      //           Modality: 'modality',
      //           StudyDescription: 'study_description',
      //           AccessionNb: 'accession_nb',
      //           StudyInstanceUID: 'study_instance_uid',
      //         },
      //       });

      //     console.log('LEVEL_STUDY:', response.body);
      //   });
      // });
    });

    describe('NOT QUERY PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { Query: false });
        console.log('Not Query token:', token);
      });

      it('POST /modalities/*/query', async () => {
        await request(server)
          .post('/modalities/1/query')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('GET /queries/*/answers*', async () => {
        await request(server)
          .get('/queries/1/answers')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /queries/:id/answers/:index/retrieve', async () => {
        await request(server)
          .post('/queries/1/answers/1/retrieve')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /modalities/:id/parsed-query', async () => {
        await request(server)
          .post('/modalities/1/parsed-query')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });
  });

  describe('Orthanc-ReadAll', () => {
    describe('READALL PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { ReadAll: true });
        console.log('ReadAll token:', token);
      });

      it('PUT /studies/*/labels/*', async () => {
        await request(server)
          .put('/studies/1/labels/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('DELETE /studies/*/labels/*', async () => {
        await request(server)
          .delete('/studies/1/labels/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('POST /tools/find', async () => {
        await request(server)
          .post('/tools/find')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('GET /patients/*', async () => {
        await request(server)
          .get('/patients/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });
    });

    describe('NOT READALL PERMISSION', () => {
      let token: string;

      beforeAll(async () => {
        token = await createCustomJwt(app, { ReadAll: false });
        console.log('Not ReadAll token:', token);
      });

      it('PUT /studies/*/labels/*', async () => {
        await request(server)
          .put('/studies/1/labels/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('DELETE /studies/*/labels/*', async () => {
        await request(server)
          .delete('/studies/1/labels/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('POST /tools/find', async () => {
        await request(server)
          .post('/tools/find')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });

      it('GET /patients/*', async () => {
        await request(server)
          .get('/patients/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });
  });
});
