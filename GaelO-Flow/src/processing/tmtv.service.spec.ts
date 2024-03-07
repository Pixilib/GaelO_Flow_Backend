import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TmtvService } from './tmtv.service';
import OrthancClient from '../orthanc/OrthancClient';
import ProcessingClient from './ProcessingClient';

describe('TmtvService', () => {
  let tmtvService: TmtvService;
  const ctId: string = '5958d213-4a906ee4-28527d57-57d250fd-847acb3f';
  const ptId: string = 'e2d08f24-7a1c85a2-b5a747b9-59ee2cda-4f10abde';

  beforeEach(async () => {
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
        console.log('here 1');
        await tmtvService.sendDicomToProcessing();
        console.log('here 2');
      },
      2 * 60 * 1000,
    );
  });
});
