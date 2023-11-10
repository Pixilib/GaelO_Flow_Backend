import { Test, TestingModule } from '@nestjs/testing'
import OrthancClient from './OrthancClient'
import { ConfigService } from '@nestjs/config';

describe('OrthancClient', () => {
    let orthancClient: OrthancClient;
    let config: ConfigService;

    beforeEach(async () => {
        config = new ConfigService();

        orthancClient = new OrthancClient(config);

        console.log(await orthancClient.getSystem())
    });

    describe('get system', () => {
    })
})