import { Test, TestingModule } from '@nestjs/testing';
import { OauthConfigService } from './oauth-configs.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OauthConfig } from './oauth-config.entity';
import { OauthConfigModule } from './oauth-configs.module';
import { OauthConfigDto } from './oauth-config.dto';

describe('OauthConfigService', () => {
  let service: OauthConfigService;
  let oauthConfigRepository: Repository<OauthConfig>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        OauthConfigModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [OauthConfig],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([OauthConfig]),
      ],
      providers: [OauthConfigService],
    }).compile();

    service = module.get<OauthConfigService>(OauthConfigService);

    oauthConfigRepository = module.get<Repository<OauthConfig>>(
      getRepositoryToken(OauthConfig),
    );

    await service.addOauthConfig({
      Provider: 'google',
      AuthorizationUrl: 'google.com',
      ClientId: 'client-id',
    });
    await service.addOauthConfig({
      Provider: 'facebook',
      AuthorizationUrl: 'facebook.com',
      ClientId: 'client-id',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByProvider', () => {
    it('should return an oauth config by provider', async () => {
      const googleConfig = await service.findOneByProvider('google');
      expect(googleConfig).toBeDefined();
      expect(googleConfig.Provider).toBe('google');
      expect(googleConfig.AuthorizationUrl).toBe('google.com');
    });

    it('should return null if the provider does not exist', async () => {
      const googleConfig = await service.findOneByProvider('twitter');
      expect(googleConfig).toBeNull();
    });
  });

  describe('findOneByAuthorizationUrl', () => {
    it('should return an oauth config by authorization url', async () => {
      const googleConfig =
        await service.findOneByAuthorizationUrl('google.com');
      expect(googleConfig).toBeDefined();
      expect(googleConfig.Provider).toBe('google');
      expect(googleConfig.AuthorizationUrl).toBe('google.com');
    });

    it('should return null if the authorization url does not exist', async () => {
      const googleConfig =
        await service.findOneByAuthorizationUrl('twitter.com');
      expect(googleConfig).toBeNull();
    });
  });

  describe('getOauthConfig', () => {
    it('should return all oauth configs', async () => {
      const oauthConfigs = await service.getOauthConfig();
      expect(oauthConfigs).toHaveLength(2);
    });
  });

  describe('deleteOauthConfig', () => {
    it('should delete an oauth config', async () => {
      await service.deleteOauthConfig('google');
      const oauthConfigs = await service.getOauthConfig();
      expect(oauthConfigs).toHaveLength(1);
    });

    it('should do nothing if the oauth config does not exist', async () => {
      await service.deleteOauthConfig('twitter');
      const oauthConfigs = await service.getOauthConfig();
      expect(oauthConfigs).toHaveLength(2);
    });
  });

  describe('addOauthConfig', () => {
    it('should add an oauth config', async () => {
      await service.addOauthConfig({
        Provider: 'twitter',
        AuthorizationUrl: 'twitter.com',
        ClientId: 'client-id',
      });
      const twitterConfig = await service.findOneByProvider('twitter');
      expect(twitterConfig).toBeDefined();
      expect(twitterConfig.Provider).toBe('twitter');
      expect(twitterConfig.AuthorizationUrl).toBe('twitter.com');
    });
  });
});
