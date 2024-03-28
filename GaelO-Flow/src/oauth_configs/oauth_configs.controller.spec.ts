import { Test } from '@nestjs/testing';
import { OauthConfigController } from './oauth_configs.controller';
import { OauthConfigService } from './oauth_configs.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('OauthConfigController', () => {
  let controller: OauthConfigController;
  let service: OauthConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [OauthConfigController],
      providers: [
        {
          provide: OauthConfigService,
          useValue: {
            getOauthConfig: jest.fn(),
            deleteOauthConfig: jest.fn(),
            addOauthConfig: jest.fn(),
            findOneByProvider: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OauthConfigController>(OauthConfigController);
    service = module.get<OauthConfigService>(OauthConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOauthConfig', () => {
    it('should return the oauth config', async () => {
      // MOCK
      const oauthConfig = [
        {
          Id: 1,
          Provider: 'google',
          AuthorizationUrl: 'google.com',
        },
      ];

      // ACT
      jest.spyOn(service, 'getOauthConfig').mockResolvedValueOnce(oauthConfig);

      // ASSERT
      expect(await controller.getOauthConfig()).toStrictEqual({
        google: { AuthorizationUrl: 'google.com' },
      });
      expect(service.getOauthConfig).toHaveBeenCalled();
    });
  });

  describe('deleteOauthConfig', () => {
    it('should delete the oauth config', async () => {
      // MOCK
      const provider = 'google';

      // ACT
      jest.spyOn(service, 'findOneByProvider').mockResolvedValueOnce({
        Id: 1,
        Provider: 'google',
        AuthorizationUrl: 'google.com',
      });
      jest.spyOn(service, 'deleteOauthConfig').mockResolvedValueOnce(undefined);

      // ASSERT
      expect(await controller.deleteOauthConfig(provider)).toBeUndefined();
      expect(service.findOneByProvider).toHaveBeenCalledWith(provider);
      expect(service.deleteOauthConfig).toHaveBeenCalledWith(provider);
    });

    it('should throw a NotFoundException if the oauth config does not exist', async () => {
      // MOCK
      const provider = 'google';

      // ACT
      jest.spyOn(service, 'findOneByProvider').mockResolvedValueOnce(undefined);

      // ASSERT
      await expect(controller.deleteOauthConfig(provider)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOneByProvider).toHaveBeenCalledWith(provider);
    });
  });

  describe('addOauthConfig', () => {
    it('should add the oauth config', async () => {
      // MOCK
      const oauthConfigDto = {
        Provider: 'google',
        AuthorizationUrl: 'google.com',
      };

      // ACT
      jest.spyOn(service, 'findOneByProvider').mockResolvedValueOnce(undefined);

      // ASSERT
      expect(await controller.addOauthConfig(oauthConfigDto)).toBeUndefined();
    });

    it('should throw a ForbiddenException if the oauth config already exists', async () => {
      // MOCK
      const oauthConfigDto = {
        Provider: 'google',
        AuthorizationUrl: 'google.com',
      };

      // ACT
      jest.spyOn(service, 'findOneByProvider').mockResolvedValueOnce({
        Id: 1,
        Provider: 'google',
        AuthorizationUrl: 'google.com',
      });

      // ASSERT
      await expect(controller.addOauthConfig(oauthConfigDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
