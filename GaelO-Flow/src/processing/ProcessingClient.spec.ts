import { Test, TestingModule } from '@nestjs/testing';
import ProcessingClient from './ProcessingClient';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { createWriteStream } from 'fs';
import exp from 'constants';

describe.skip('OrthancClient', () => {
  let processingClient: ProcessingClient;
  const PATH = process.cwd() + '/tmp/';

  const PET = {
    filePath: PATH + '8.000000-PET.zip',
    gifPath: PATH + 'mip_pet.gif',
    gifWMaskPath: PATH + 'mip_pet_w_mask.gif',
    pngPath: PATH + 'mosaic_pet.png',
    gzipPath: PATH + 'PET.gzip',
    dicomUuid: null,
    seriesId: null,
  };

  const GK = {
    filePath: PATH + '5.000000-GK.zip',
    gifPath: PATH + 'mip_gk.gif',
    pngPath: PATH + 'mosaic_gk.png',
    gzipPath: PATH + 'GK.gzip',
    dicomUuid: null,
    seriesId: null,
  };

  const mask = {
    maskGzip: PATH + 'mask.gzip',
    rtssPath: PATH + 'RTSS.gzip',
    segPath: PATH + 'SEG.gzip',
    maskDicomOrientation: PATH + 'mask_dicom_orientation.gzip',
    rtssID: null,
    segID: null,
    thresholdedMaskId: null,
    fragmentMaskId: null,
    inferenceID: null,
    stat: null,
    statSeries: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.testing',
          isGlobal: true,
        }),
      ],
      providers: [ProcessingClient],
    }).compile();

    processingClient = module.get<ProcessingClient>(ProcessingClient);
  });

  it('should be defined', () => {
    expect(processingClient).toBeDefined();
  });

  describe('createDicom', () => {
    it(
      'should create a GK dicom',
      async () => {
        const streamGK = await readFile(GK.filePath);
        const responseGK = await processingClient.createDicom(streamGK);
        expect(responseGK).toBeDefined();
        GK.dicomUuid = responseGK.data;
        expect(GK.dicomUuid).toBeDefined();
      },
      2 * 60 * 1000,
    );

    it(
      'should create a PET dicom',
      async () => {
        const streamPET = await readFile(join(PET.filePath));
        const responsePET = await processingClient.createDicom(streamPET);
        expect(responsePET).toBeDefined();
        PET.dicomUuid = responsePET.data;
        expect(PET.dicomUuid).toBeDefined();
      },
      2 * 60 * 1000,
    );
  });

  describe('createSeriesFromOrthanc', () => {
    it(
      'create a GK series',
      async () => {
        const response = await processingClient.createSeriesFromOrthanc(
          GK.dicomUuid,
          false,
          false,
        );
        expect(response).toBeDefined();
        GK.seriesId = response.data;
        expect(GK.seriesId).toBeDefined();
      },
      2 * 60 * 1000,
    );

    it(
      'create a PET series',
      async () => {
        const response = await processingClient.createSeriesFromOrthanc(
          PET.dicomUuid,
          true,
          true,
        );
        expect(response).toBeDefined();
        PET.seriesId = response.data;
        expect(PET.seriesId).toBeDefined();
      },
      2 * 60 * 1000,
    );
  });

  describe('executeInference', () => {
    it(
      'should execute inference',
      async () => {
        const response = await processingClient.executeInference(
          'pt_seg_attentionunet',
          { idCT: GK.seriesId, idPT: PET.seriesId },
        );
        expect(response).toBeDefined();
        expect(response.data).toBeDefined();

        mask.inferenceID = response.data['id_mask'];
      },
      2 * 60 * 1000,
    );
  });

  describe('createMIPForSeries', () => {
    it(
      'should create a MIP for GK series',
      async () => {
        const response = await processingClient.createMIPForSeries(GK.seriesId);
        expect(response).toBeDefined();
        expect(response.headers['content-type']).toBe('image/gif');

        const file = createWriteStream(GK.gifPath);

        response.data.pipe(file);

        file.on('finish', () => {
          file.close();
        });
      },
      2 * 60 * 1000,
    );

    it(
      'should create a MIP for PET series',
      async () => {
        const response = await processingClient.createMIPForSeries(
          PET.seriesId,
        );
        expect(response).toBeDefined();
        expect(response.headers['content-type']).toBe('image/gif');

        const file = createWriteStream(PET.gifPath);
        response.data.pipe(file);

        file.on('finish', () => {
          file.close();
        });
      },
      2 * 60 * 1000,
    );

    it(
      'should create mip with mask for PET series',
      async () => {
        const mipFragmentedPayload = {
          maskId: mask.inferenceID,
          delay: 0.3,
          min: 0,
          max: 20,
          inverted: true,
          orientation: 'LPI',
        };
        const response = await processingClient.createMIPForSeries(
          PET.seriesId,
          mipFragmentedPayload,
        );

        expect(response).toBeDefined();
        expect(response.headers['content-type']).toBe('image/gif');

        const file = createWriteStream(PET.gifWMaskPath);
        response.data.pipe(file);

        file.on('finish', () => {
          file.close();
        });
      },
      2 * 60 * 1000,
    );
  });

  describe('createMosaicForSeries', () => {
    it('should create a mosaic for GK series', async () => {
      const response = await processingClient.createMosaicForSeries(
        GK.seriesId,
      );
      expect(response).toBeDefined();
      expect(response.headers['content-type']).toBe('image/png');

      const file = createWriteStream(GK.pngPath);
      response.data.pipe(file);

      file.on('finish', () => {
        file.close();
      });
    });

    it('should create a mosaic for PET series', async () => {
      const response = await processingClient.createMosaicForSeries(
        PET.seriesId,
      );
      expect(response).toBeDefined();
      expect(response.headers['content-type']).toBe('image/png');

      const file = createWriteStream(PET.pngPath);
      response.data.pipe(file);

      file.on('finish', () => {
        file.close();
      });
    });
  });

  describe('getNiftiMask', () => {
    it('should execute getNiftiMask', async () => {
      const response = await processingClient.getNiftiMask(mask.inferenceID);
      expect(response).toBeDefined();
      expect(response.headers['content-type']).toBe('application/gzip');

      const file = createWriteStream(mask.maskGzip);
      response.data.pipe(file);

      file.on('finish', () => {
        file.close();
      });
    });
  });

  describe('getNiftiSeries', () => {
    it('should get the GK nifti series', async () => {
      const response = await processingClient.getNiftiSeries(GK.seriesId);
      expect(response).toBeDefined();
      expect(response.headers['content-type']).toBe('application/gzip');

      const file = createWriteStream(GK.gzipPath);
      response.data.pipe(file);

      file.on('finish', () => {
        file.close();
      });
    });

    it('should get the PET nifti series', async () => {
      const response = await processingClient.getNiftiSeries(PET.seriesId);
      expect(response).toBeDefined();
      expect(response.headers['content-type']).toBe('application/gzip');

      const file = createWriteStream(PET.gzipPath);
      response.data.pipe(file);

      file.on('finish', () => {
        file.close();
      });
    });
  });

  describe('createRtssFromMask', () => {
    it('should create a RTSS from the mask', async () => {
      const response = await processingClient.createRtssFromMask(
        PET.dicomUuid,
        mask.inferenceID,
      );
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      mask.rtssID = response.data;
    });
  });

  describe('getRtss', () => {
    it('should get the RTSS', async () => {
      const response = await processingClient.getRtss(mask.rtssID);
      expect(response).toBeDefined();
      expect(response.headers['content-type']).toBe('application/octet-stream');

      const file = createWriteStream(mask.rtssPath);
      response.data.pipe(file);

      file.on('finish', () => {
        file.close();
      });
    });
  });

  describe('createSegFromMask', () => {
    it('should create a SEG from the mask', async () => {
      const response = await processingClient.createSegFromMask(
        PET.dicomUuid,
        mask.inferenceID,
      );
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      mask.segID = response.data;
    });
  });

  describe('getSeg', () => {
    it('should get the SEG', async () => {
      const response = await processingClient.getSeg(mask.segID);
      expect(response).toBeDefined();
      expect(response.headers['content-type']).toBe('application/octet-stream');

      const file = createWriteStream(mask.segPath);
      response.data.pipe(file);

      file.on('finish', () => {
        file.close();
      });
    });
  });

  describe('thresholdMask', () => {
    it('should give a new mask id', async () => {
      const response = await processingClient.thresholdMask(
        mask.inferenceID,
        PET.seriesId,
        20,
      );
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      mask.thresholdedMaskId = response.data;
    });
  });

  describe('fragmentMask', () => {
    it('should give a new mask id', async () => {
      const response = await processingClient.fragmentMask(
        PET.seriesId,
        mask.inferenceID,
        true,
      );
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      mask.fragmentMaskId = response.data;
    });
  });

  describe('getMaskDicomOrientation', () => {
    it('should get the mask dicom orientation', async () => {
      const response = await processingClient.getMaskDicomOrientation(
        mask.inferenceID,
        'LPI',
        true,
      );
      expect(response).toBeDefined();
      expect(response.headers['content-type']).toBe('application/gzip');

      const file = createWriteStream(mask.maskDicomOrientation);
      response.data.pipe(file);

      file.on('finish', () => {
        file.close();
      });
    });
  });

  describe('getStatMask', () => {
    it('should get the stats for the mask', async () => {
      const response = await processingClient.getStatsMask(mask.inferenceID);
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      mask.stat = response.data;

      expect(response.data['dmax']).toBeDefined();
      expect(response.data['volume']).toBeDefined();
    });
  });

  describe('getStatsMaskSeries', () => {
    it('should get the stat for the mask and series', async () => {
      const response = await processingClient.getStatsMaskSeries(
        mask.inferenceID,
        PET.seriesId,
      );
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      mask.statSeries = response.data;

      expect(response.data['dmax']).toBeDefined();
      expect(response.data['volume']).toBeDefined();
      expect(response.data['suvmean']).toBeDefined();
      expect(response.data['suvmax']).toBeDefined();
      expect(response.data['suvpeak']).toBeDefined();
      expect(response.data['tlg']).toBeDefined();
      expect(response.data['dmaxbulk']).toBeDefined();
    });
  });

  describe('deleteRessource', () => {
    describe('delete GK', () => {
      it('should delete the GK series', async () => {
        const response = await processingClient.deleteRessource(
          'series',
          GK.seriesId,
        );
        expect(response).toBeDefined();
        expect(response.data).toBeDefined();
      });

      it('should delete the GK dicom', async () => {
        const response = await processingClient.deleteRessource(
          'dicoms',
          GK.dicomUuid,
        );
        expect(response).toBeDefined();
        expect(response.data).toBeDefined();
      });
    });

    describe('delete PET', () => {
      it('should delete the PET series', async () => {
        const response = await processingClient.deleteRessource(
          'series',
          PET.seriesId,
        );
        expect(response).toBeDefined();
        expect(response.data).toBeDefined();
      });

      it('should delete the PET dicom', async () => {
        const response = await processingClient.deleteRessource(
          'dicoms',
          PET.dicomUuid,
        );
        expect(response).toBeDefined();
        expect(response.data).toBeDefined();
      });
    });

    describe('delete mask', () => {
      it('should delete the mask inference ID', async () => {
        const response = await processingClient.deleteRessource(
          'masks',
          mask.inferenceID,
        );
        expect(response).toBeDefined();
        expect(response.data).toBeDefined();
      });

      it('should delete the thresholded mask ID', async () => {
        const response = await processingClient.deleteRessource(
          'masks',
          mask.thresholdedMaskId,
        );
        expect(response).toBeDefined();
        expect(response.data).toBeDefined();
      });

      it('should delete the fragment mask ID', async () => {
        const response = await processingClient.deleteRessource(
          'masks',
          mask.fragmentMaskId,
        );
        expect(response).toBeDefined();
        expect(response.data).toBeDefined();
      });

      it('should delete the RTSS ID', async () => {
        const response = await processingClient.deleteRessource(
          'rtss',
          mask.rtssID,
        );
        expect(response).toBeDefined();
        expect(response.data).toBeDefined();
      });

      it('should delete the SEG ID', async () => {
        const response = await processingClient.deleteRessource(
          'seg',
          mask.segID,
        );
        expect(response).toBeDefined();
        expect(response.data).toBeDefined();
      });
    });
  });

  afterAll(async () => {
    console.log(`GK: ${JSON.stringify(GK, null, 2)}`);
    console.log(`PET: ${JSON.stringify(PET, null, 2)}`);
    console.log(`mask: ${JSON.stringify(mask, null, 2)}`);
  });
});
