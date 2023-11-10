import { Test, TestingModule } from '@nestjs/testing';
import OrthancClient from './OrthancClient';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('OrthancClient', () => {
  let orthancClient: OrthancClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
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
      expect(typeof answer.DicomAet).toBe("string")
    });
  });
});
