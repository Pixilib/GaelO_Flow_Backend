import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TmtvService } from './tmtv.service';
import OrthancClient from '../utils/orthanc-client';
import ProcessingClient from '../utils/processing.client';

describe.skip('TmtvService', () => {
  let tmtvService: TmtvService;
  let orthancClient: OrthancClient;
  let processingClient: ProcessingClient;
  const ctId: string = '5a8ba2db-8135be1f-1a3cb132-7d0a5e5d-9080e7a2';
  const ptId: string = 'a3cdfd1f-941dc8eb-806e242f-cc299eef-19ca52b1';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.testing', '.env'],
          isGlobal: true,
        }),
      ],
      providers: [TmtvService, OrthancClient, ProcessingClient],
    }).compile();

    orthancClient = module.get<OrthancClient>(OrthancClient);
    processingClient = module.get<ProcessingClient>(ProcessingClient);
    tmtvService = new TmtvService(orthancClient, processingClient);
    tmtvService.setCtOrthancSeriesId(ctId);
    tmtvService.setPtOrthancSeriesId(ptId);
  });

  it('should be defined', () => {
    expect(tmtvService).toBeDefined();
  });

  describe('sendDicomToProcessing', () => {
    it(
      'should call ProcessingClient sendDicomToProcessing',
      async () => {
        await tmtvService.sendDicomToProcessing();

        expect(tmtvService.getCreatedFiles().length).toBe(2);
      },
      5 * 60 * 1000,
    );
  });

  describe('createSeries', () => {
    it(
      'should call ProcessingClient createSeriesFromOrthanc',
      async () => {
        await tmtvService.createSeries();

        expect(tmtvService.getCreatedFiles().length).toBe(4);
      },
      2 * 60 * 1000,
    );
  });

  describe('runInference', () => {
    it(
      'should call ProcessingClient executeInference',
      async () => {
        await tmtvService.runInference(true);

        expect(tmtvService.getCreatedFiles().length).toBe(6);
      },
      2 * 60 * 1000,
    );
  });
  describe('send', () => {
    describe('sendMaskAsRtssToOrthanc', () => {
      it(
        'should call ProcessingClient sendMaskAsRtssToOrthanc',
        async () => {
          const results = await tmtvService.sendMaskAsRtssToOrthanc();

          expect(results).toBeDefined();
        },
        2 * 60 * 1000,
      );
    });

    describe('sendMaskAsSegToOrthanc', () => {
      it(
        'should call ProcessingClient sendMaskAsSegToOrthanc',
        async () => {
          const results = await tmtvService.sendMaskAsSegToOrthanc();

          expect(results).toBeDefined();
        },
        2 * 60 * 1000,
      );
    });
  });

  describe('deleteAllRessources', () => {
    it('should call ProcessingClient deleteRessource', async () => {
      await tmtvService.deleteAllRessources();

      expect(tmtvService.getCreatedFiles().length).toBe(0);
    });
  });
});
