import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OauthConfig } from './oauth-config.entity';
import { OauthConfigModule } from './oauth-configs.module';
import { OauthConfigService } from './oauth-configs.service';

describe('OauthConfigService', () => {
  let service: OauthConfigService;

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

    await service.addOauthConfig({
      Name: 'google',
      Provider: 'google',
      AuthorizationUrl: 'google.com',
      ClientId: 'client-id',
    });
    await service.addOauthConfig({
      Name: 'facebook',
      Provider: 'facebook',
      AuthorizationUrl: 'facebook.com',
      ClientId: 'client-id',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByName', () => {
    it('should return an oauth config by provider', async () => {
      const googleConfig = await service.findOneByName('google');
      expect(googleConfig).toBeDefined();
      expect(googleConfig.Provider).toBe('google');
      expect(googleConfig.AuthorizationUrl).toBe('google.com');
    });

    it('should return null if the provider does not exist', async () => {
      const googleConfig = await service.findOneByName('twitter');
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
        Name: 'twitter',
        Provider: 'twitter',
        AuthorizationUrl: 'twitter.com',
        ClientId: 'client-id',
      });
      const twitterConfig = await service.findOneByName('twitter');
      expect(twitterConfig).toBeDefined();
      expect(twitterConfig.Provider).toBe('twitter');
      expect(twitterConfig.AuthorizationUrl).toBe('twitter.com');
    });
  });
});
