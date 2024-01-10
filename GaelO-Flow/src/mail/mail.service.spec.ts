import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail.module';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule, ConfigModule],
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
