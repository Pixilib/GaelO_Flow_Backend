import { createWriteStream } from 'fs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import OrthancClient from './orthanc-client';

describe('OrthancClient', () => {
  let orthancClient: OrthancClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.testing', '.env'],
          isGlobal: true,
        }),
      ],
      providers: [OrthancClient, ConfigService],
    }).compile();
    orthancClient = module.get<OrthancClient>(OrthancClient);
  });

  describe('get system', () => {
    it('check is get systems works', async () => {
      const answer = await orthancClient.getSystem();
      expect(typeof answer.DicomAet).toBe('string');
    });
  });

  describe('get archive dicom as stream', () => {
    it(
      'downloads archive from orthanc',
      async () => {
        const ptId: string = 'e2d08f24-7a1c85a2-b5a747b9-59ee2cda-4f10abde';
        const file = createWriteStream('dicom.zip');

        await orthancClient
          .getArchiveDicomAsStream([ptId])
          .then(async (result) => {
            result.pipe(file);

            await new Promise((resolve) => file.on('finish', resolve));
          });
      },
      2 * 60 * 1000,
    );
  });
});
