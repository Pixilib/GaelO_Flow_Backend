import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TmtvService } from './tmtv.service';
import OrthancClient from '../orthanc/OrthancClient';
import ProcessingClient from './ProcessingClient';

describe.skip('TmtvService', () => {
  let tmtvService: TmtvService;
  const ctId: string = '5958d213-4a906ee4-28527d57-57d250fd-847acb3f';
  const ptId: string = 'e2d08f24-7a1c85a2-b5a747b9-59ee2cda-4f10abde';

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

    tmtvService = module.get<TmtvService>(TmtvService);
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
      2 * 60 * 1000,
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

  describe('deleteAllRessources', () => {
    it('should call ProcessingClient deleteRessource', async () => {
      await tmtvService.deleteAllRessources();

      expect(tmtvService.getCreatedFiles().length).toBe(0);
    });
  });
});
