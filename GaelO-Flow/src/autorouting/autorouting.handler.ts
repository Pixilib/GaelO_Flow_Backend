import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { OrthancEventPayloadDto } from './dto/orthanc-event-payload.dto';
import { AutoroutingsService } from './autoroutings.service';
import { Autorouting, Destination, Router, Rule } from './autorouting.entity';
import {
  AutoroutingEventType,
  Condition,
  DestinationType,
  LevelType,
  RuleCondition,
  ValueRepresentation,
} from './autorouting.enum';
import OrthancClient from '../utils/orthanc-client';
import * as moment from 'moment';
import { ProcessingQueueService } from '../processing/processing-queue.service';
import { ProcessingJobType, ProcessingMask } from 'src/constants/enums';

@Injectable()
export class AutoroutingHandler {
  autoroutingConfigs: Array<Autorouting> = [];

  levelMapping = {
    [AutoroutingEventType.NEW_INSTANCE]: LevelType.INSTANCES,
    [AutoroutingEventType.NEW_SERIES]: LevelType.SERIES,
    [AutoroutingEventType.NEW_STUDY]: LevelType.STUDIES,
    [AutoroutingEventType.NEW_PATIENT]: LevelType.PATIENTS,
    [AutoroutingEventType.STABLE_SERIES]: LevelType.SERIES,
    [AutoroutingEventType.STABLE_STUDY]: LevelType.STUDIES,
    [AutoroutingEventType.STABLE_PATIENT]: LevelType.PATIENTS,
  };

  constructor(
    private autoroutingService: AutoroutingsService,
    private processingQueueService: ProcessingQueueService,
    private orthancClient: OrthancClient,
  ) {
    this.handleAutoroutingUpdated();
  }

  @OnEvent('autorouting.updated')
  async handleAutoroutingUpdated() {
    this.autoroutingConfigs = await this.autoroutingService.findAll();
  }

  private isEqual(value: string | number, rule: Rule): boolean {
    if (rule.ValueRepresentation === ValueRepresentation.NUMBER) {
      return value === Number(rule.Value);
    } else if (rule.ValueRepresentation === ValueRepresentation.STRING) {
      return value === rule.Value.toString();
    } else if (rule.ValueRepresentation === ValueRepresentation.DATE) {
      return moment(value.toString()).isSame(moment(rule.Value.toString()));
    }
    return false;
  }

  private isIn(value: string | number, rule: Rule): boolean {
    if (rule.ValueRepresentation === ValueRepresentation.STRING) {
      return rule.Value.toString().includes(value.toString());
    }
    return false;
  }

  private isNotIn(value: string | number, rule: Rule): boolean {
    if (rule.ValueRepresentation === ValueRepresentation.STRING) {
      return !rule.Value.toString().includes(value.toString());
    }
    return false;
  }

  private isGreaterThan(value: string | number, rule: Rule): boolean {
    if (rule.ValueRepresentation === ValueRepresentation.NUMBER) {
      return Number(value) > Number(rule.Value);
    } else if (rule.ValueRepresentation === ValueRepresentation.DATE) {
      return moment(value.toString()).isAfter(moment(rule.Value.toString()));
    }
    return false;
  }

  private isLessThan(value: string | number, rule: Rule): boolean {
    if (rule.ValueRepresentation === ValueRepresentation.NUMBER) {
      return Number(value) < Number(rule.Value);
    } else if (rule.ValueRepresentation === ValueRepresentation.DATE) {
      return moment(value.toString()).isBefore(moment(rule.Value.toString()));
    }
    return false;
  }

  private ruleToBoolean(rule: Rule, data: any): boolean {
    const dicomTagValue = data.MainDicomTags[rule.DicomTag];

    if (
      rule.ValueRepresentation === ValueRepresentation.DATE &&
      (!moment(dicomTagValue).isValid() || !moment(rule.Value).isValid())
    ) {
      return false;
    }

    switch (rule.Condition) {
      case Condition.EQUALS:
        return this.isEqual(dicomTagValue, rule);
      case Condition.DIFFERENT:
        return !this.isEqual(dicomTagValue, rule);
      case Condition.IN:
        return this.isIn(dicomTagValue, rule);
      case Condition.NOT_IN:
        return this.isNotIn(dicomTagValue, rule);
      case Condition.LESS_THAN:
        return this.isLessThan(dicomTagValue, rule);
      case Condition.GREATER_THAN:
        return this.isGreaterThan(dicomTagValue, rule);
    }
  }

  private isSendable(router: Router, data: any): boolean {
    switch (router.RuleCondition) {
      case RuleCondition.AND:
        for (const rule of router.Rules) {
          if (!this.ruleToBoolean(rule, data)) return false;
        }
        return true;
      case RuleCondition.OR:
        for (const rule of router.Rules) {
          if (this.ruleToBoolean(rule, data)) return true;
        }
        return false;
    }
  }

  private async sendToDestination(
    destination: Destination,
    level: LevelType,
    orthancID: string,
  ) {
    switch (destination.Destination) {
      case DestinationType.AET:
        this.orthancClient
          .sendToAET(destination.Name, [orthancID])
          .catch((e) => {
            console.error("can't send to aet: ", e);
          });
        break;
      case DestinationType.TMTVJOB:
        if (level !== LevelType.STUDIES) {
          console.error('TMTVJob can only be sent to series');
          return;
        }

        const seriesDetails = await this.orthancClient
          .getSeriesDetailsOfStudy(orthancID)
          .then((res) => {
            return res.data;
          })
          .catch((e) => {
            return [];
          });

        const allModalities = seriesDetails.map(
          (series: any) => series.MainDicomTags.Modality,
        );

        if (
          allModalities.length !== 2 ||
          !allModalities.includes('PT') ||
          !allModalities.includes('CT')
        ) {
          console.error('Invalid series modalities: ', allModalities);
          return;
        }

        const ctSeriesID = seriesDetails.find(
          (series: any) => series.MainDicomTags.Modality === 'CT',
        ).ID;

        const ptSeriesID = seriesDetails.find(
          (series: any) => series.MainDicomTags.Modality === 'PT',
        ).ID;

        const jobId = await this.processingQueueService.addJob(null, {
          JobType: ProcessingJobType.TMTV,
          TmtvJob: {
            PtOrthancSeriesId: ptSeriesID,
            CtOrthancSeriesId: ctSeriesID,
            SendMaskToOrthancAs: [ProcessingMask.RTSS, ProcessingMask.SEG],
            WithFragmentedMask: true,
          },
        });

        console.log('ctSeriesID:', ctSeriesID);
        console.log('ptSeriesID:', ptSeriesID);
        console.log('jobId:', jobId);

        break;
      case DestinationType.PEER:
        console.log('Sending to Peer', destination, orthancID);
        this.orthancClient
          .sendToPeer(destination.Name, [orthancID])
          .catch((e) => {
            console.error("can't send to peer: ", e);
          });
        break;
    }
  }

  async processEvent(
    autorouting: Autorouting,
    payload: OrthancEventPayloadDto,
  ) {
    const level = this.levelMapping[payload.ChangeType];
    const data = (await this.orthancClient.getOrthancDetails(level, payload.ID))
      .data;
    const isSendable = this.isSendable(autorouting.Router, data);

    if (isSendable) {
      for (const destination of autorouting.Router.Destinations) {
        this.sendToDestination(destination, level, payload.ID);
      }
    }
  }

  @OnEvent('orthanc.*')
  async handleEvent(payload: OrthancEventPayloadDto) {
    const autoroutingMatches = this.autoroutingConfigs.filter(
      (autorouting) =>
        autorouting.EventType === payload.ChangeType && autorouting.Activated,
    );

    autoroutingMatches.forEach((autorouting: Autorouting) => {
      this.processEvent(autorouting, payload);
    });
  }
}
