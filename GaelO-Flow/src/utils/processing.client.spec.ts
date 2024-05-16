import { readFile } from 'fs/promises';
import { join } from 'path';
import { createWriteStream } from 'fs';

import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import ProcessingClient from './processing.client';

describe.skip('ProcessingClient', () => {
  let processingClient: ProcessingClient;
  const PATH = process.cwd() + '/tmp/';

  const PET = {
    filePath: PATH + '8.000000-PET.zip',
    gifPath: PATH + 'mip_pet.gif',
    gifWMaskPath: PATH + 'mip_pet_w_mask.gif',
    pngPath: PATH + 'mosaic_pet.png',
    gzipPath: PATH + 'PET.gz',
    dicomUuid: null,
    seriesId: null,
  };

  const GK = {
    filePath: PATH + '5.000000-GK.zip',
    gifPath: PATH + 'mip_gk.gif',
    pngPath: PATH + 'mosaic_gk.png',
    gzipPath: PATH + 'GK.gz',
    dicomUuid: null,
    seriesId: null,
  };

  const mask = {
    maskGzip: PATH + 'mask.gz',
    rtssPath: PATH + 'RTSS',
    segPath: PATH + 'SEG',
    maskDicomOrientation: PATH + 'mask_dicom_orientation.gz',
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
          envFilePath: ['.env.testing', '.env'],
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
        GK.dicomUuid = await processingClient.createDicom(streamGK);
        expect(GK.dicomUuid).toBeDefined();
      },
      10 * 60 * 1000,
    );

    it(
      'should create a PET dicom',
      async () => {
        const streamPET = await readFile(join(PET.filePath));
        PET.dicomUuid = await processingClient.createDicom(streamPET);
        expect(PET.dicomUuid).toBeDefined();
      },
      10 * 60 * 1000,
    );
  });

  describe('createSeriesFromOrthanc', () => {
    it(
      'create a GK series',
      async () => {
        GK.seriesId = await processingClient.createSeriesFromOrthanc(
          GK.dicomUuid,
          false,
          false,
        );
        expect(GK.seriesId).toBeDefined();
        expect(GK.seriesId).toBeDefined();
      },
      10 * 60 * 1000,
    );

    it(
      'create a PET series',
      async () => {
        PET.seriesId = await processingClient.createSeriesFromOrthanc(
          PET.dicomUuid,
          true,
          true,
        );
        expect(PET.seriesId).toBeDefined();
        expect(PET.seriesId).toBeDefined();
      },
      10 * 60 * 1000,
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
        mask.inferenceID = response['id_mask'];
        expect(mask.inferenceID).toBeDefined();
      },
      10 * 60 * 1000,
    );
  });

  describe('createMIPForSeries', () => {
    it(
      'should create a MIP for GK series',
      async () => {
        await processingClient
          .createMIPForSeries(GK.seriesId)
          .then(async (res) => {
            const file = createWriteStream(GK.gifPath);
            res.pipe(file);
            await new Promise((resolve) => file.on('finish', resolve));
          });
      },
      10 * 60 * 1000,
    );

    it(
      'should create a MIP for PET series',
      async () => {
        await processingClient
          .createMIPForSeries(PET.seriesId)
          .then(async (res) => {
            const file = createWriteStream(PET.gifPath);
            res.pipe(file);
            await new Promise((resolve) => file.on('finish', resolve));
          });
      },
      10 * 60 * 1000,
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
        await processingClient
          .createMIPForSeries(PET.seriesId, mipFragmentedPayload)
          .then(async (res) => {
            const file = createWriteStream(PET.gifWMaskPath);
            res.pipe(file);
            await new Promise((resolve) => file.on('finish', resolve));
          });
      },
      10 * 60 * 1000,
    );
  });

  describe('createMosaicForSeries', () => {
    it(
      'should create a mosaic for GK series',
      async () => {
        await processingClient
          .createMosaicForSeries(GK.seriesId)
          .then(async (res) => {
            const file = createWriteStream(GK.pngPath);
            res.pipe(file);
            await new Promise((resolve) => file.on('finish', resolve));
          });
      },
      10 * 60 * 1000,
    );

    it(
      'should create a mosaic for PET series',
      async () => {
        await processingClient
          .createMosaicForSeries(PET.seriesId)
          .then(async (res) => {
            const file = createWriteStream(PET.pngPath);
            res.pipe(file);
            await new Promise((resolve) => file.on('finish', resolve));
          });
      },
      10 * 60 * 1000,
    );
  });

  describe('getNiftiMask', () => {
    it(
      'should execute getNiftiMask',
      async () => {
        await processingClient
          .getNiftiMask(mask.inferenceID)
          .then(async (res) => {
            const file = createWriteStream(mask.maskGzip);
            res.pipe(file);
            await new Promise((resolve) => file.on('finish', resolve));
          });
      },
      10 * 60 * 1000,
    );
  });

  describe('getNiftiSeries', () => {
    it(
      'should get the GK nifti series',
      async () => {
        await processingClient.getNiftiSeries(GK.seriesId).then(async (res) => {
          const file = createWriteStream(GK.gzipPath);
          res.pipe(file);
          await new Promise((resolve) => file.on('finish', resolve));
        });
      },
      10 * 60 * 1000,
    );

    it(
      'should get the PET nifti series',
      async () => {
        await processingClient
          .getNiftiSeries(PET.seriesId)
          .then(async (res) => {
            const file = createWriteStream(PET.gzipPath);
            res.pipe(file);
            await new Promise((resolve) => file.on('finish', resolve));
          });
      },
      10 * 60 * 1000,
    );
  });

  describe('createRtssFromMask', () => {
    it(
      'should create a RTSS from the mask',
      async () => {
        mask.rtssID = await processingClient.createRtssFromMask(
          PET.dicomUuid,
          mask.inferenceID,
        );
        expect(mask.rtssID).toBeDefined();
      },
      10 * 60 * 1000,
    );
  });

  describe('getRtss', () => {
    it(
      'should get the RTSS',
      async () => {
        await processingClient.getRtss(mask.rtssID).then(async (res) => {
          const file = createWriteStream(mask.rtssPath);
          res.pipe(file);
          await new Promise((resolve) => file.on('finish', resolve));
        });
      },
      10 * 60 * 1000,
    );
  });

  describe('createSegFromMask', () => {
    it(
      'should create a SEG from the mask',
      async () => {
        mask.segID = await processingClient.createSegFromMask(
          PET.dicomUuid,
          mask.inferenceID,
        );
        expect(mask.segID).toBeDefined();
      },
      10 * 60 * 1000,
    );
  });

  describe('getSeg', () => {
    it(
      'should get the SEG',
      async () => {
        await processingClient.getSeg(mask.segID).then(async (res) => {
          const file = createWriteStream(mask.segPath);
          res.pipe(file);
          await new Promise((resolve) => file.on('finish', resolve));
        });
      },
      10 * 60 * 1000,
    );
  });

  describe('thresholdMask', () => {
    it(
      'should give a new mask id',
      async () => {
        mask.thresholdedMaskId = await processingClient.thresholdMask(
          mask.inferenceID,
          PET.seriesId,
          20,
        );
        expect(mask.thresholdedMaskId).toBeDefined();
      },
      10 * 60 * 1000,
    );
  });

  describe('fragmentMask', () => {
    it(
      'should give a new mask id',
      async () => {
        mask.fragmentMaskId = await processingClient.fragmentMask(
          PET.seriesId,
          mask.inferenceID,
          true,
        );
        expect(mask.fragmentMaskId).toBeDefined();
      },
      10 * 60 * 1000,
    );
  });

  describe('getMaskDicomOrientation', () => {
    it(
      'should get the mask dicom orientation',
      async () => {
        await processingClient
          .getMaskDicomOrientation(mask.inferenceID, 'LPI', true)
          .then(async (res) => {
            const file = createWriteStream(mask.maskDicomOrientation);
            res.pipe(file);
            await new Promise((resolve) => file.on('finish', resolve));
          });
      },
      10 * 60 * 1000,
    );
  });

  describe('getStatMask', () => {
    it(
      'should get the stats for the mask',
      async () => {
        mask.stat = await processingClient.getStatsMask(mask.inferenceID);
        expect(mask.stat).toBeDefined();

        expect(mask.stat['dmax']).toBeDefined();
        expect(mask.stat['volume']).toBeDefined();
      },
      10 * 60 * 1000,
    );
  });

  describe('getStatsMaskSeries', () => {
    it(
      'should get the stat for the mask and series',
      async () => {
        const stats = await processingClient.getStatsMaskSeries(
          mask.inferenceID,
          PET.seriesId,
        );
        expect(stats).toBeDefined();
        mask.statSeries = stats;

        expect(stats['dmax']).toBeDefined();
        expect(stats['volume']).toBeDefined();
        expect(stats['suvmean']).toBeDefined();
        expect(stats['suvmax']).toBeDefined();
        expect(stats['suvpeak']).toBeDefined();
        expect(stats['tlg']).toBeDefined();
        expect(stats['dmaxbulk']).toBeDefined();
      },
      10 * 60 * 1000,
    );
  });

  describe('deleteRessource', () => {
    describe('delete GK', () => {
      it(
        'should delete the GK series',
        async () => {
          const response = await processingClient.deleteRessource(
            'series',
            GK.seriesId,
          );
          expect(response).toBeTruthy();
        },
        10 * 60 * 1000,
      );

      it(
        'should delete the GK dicom',
        async () => {
          const response = await processingClient.deleteRessource(
            'dicoms',
            GK.dicomUuid,
          );
          expect(response).toBeDefined();
        },
        10 * 60 * 1000,
      );
    });

    describe('delete PET', () => {
      it(
        'should delete the PET series',
        async () => {
          const response = await processingClient.deleteRessource(
            'series',
            PET.seriesId,
          );
          expect(response).toBeDefined();
        },
        10 * 60 * 1000,
      );

      it(
        'should delete the PET dicom',
        async () => {
          const response = await processingClient.deleteRessource(
            'dicoms',
            PET.dicomUuid,
          );
          expect(response).toBeDefined();
        },
        10 * 60 * 1000,
      );
    });

    describe('delete mask', () => {
      it(
        'should delete the mask inference ID',
        async () => {
          const response = await processingClient.deleteRessource(
            'masks',
            mask.inferenceID,
          );
          expect(response).toBeDefined();
        },
        10 * 60 * 1000,
      );

      it(
        'should delete the thresholded mask ID',
        async () => {
          const response = await processingClient.deleteRessource(
            'masks',
            mask.thresholdedMaskId,
          );
          expect(response).toBeDefined();
        },
        10 * 60 * 1000,
      );

      it(
        'should delete the fragment mask ID',
        async () => {
          const response = await processingClient.deleteRessource(
            'masks',
            mask.fragmentMaskId,
          );
          expect(response).toBeDefined();
        },
        10 * 60 * 1000,
      );

      it(
        'should delete the RTSS ID',
        async () => {
          const response = await processingClient.deleteRessource(
            'rtss',
            mask.rtssID,
          );
          expect(response).toBeDefined();
        },
        10 * 60 * 1000,
      );

      it(
        'should delete the SEG ID',
        async () => {
          const response = await processingClient.deleteRessource(
            'seg',
            mask.segID,
          );
          expect(response).toBeDefined();
        },
        10 * 60 * 1000,
      );
    });
  });

  afterAll(async () => {
    console.log(`GK: ${JSON.stringify(GK, null, 2)}`);
    console.log(`PET: ${JSON.stringify(PET, null, 2)}`);
    console.log(`mask: ${JSON.stringify(mask, null, 2)}`);
  });
});
