import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Autorouting } from './autorouting.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AutoroutingEventType } from './autorouting.enum';

@Injectable()
export class AutoroutingsService {
  constructor(
    @InjectRepository(Autorouting)
    private autoroutingsRepository: Repository<Autorouting>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<Autorouting[]> {
    return await this.autoroutingsRepository.find();
  }

  async findOneByEventType(
    eventType: AutoroutingEventType,
  ): Promise<Autorouting[]> {
    return await this.autoroutingsRepository.find({
      where: { EventType: eventType, Activated: true },
    });
  }

  async findOneOrFail(id: number): Promise<Autorouting> {
    return await this.autoroutingsRepository.findOneOrFail({
      where: { Id: id },
    });
  }

  async create(autorouting: Autorouting): Promise<void> {
    await this.autoroutingsRepository.save(autorouting);
    this.eventEmitter.emit('autorouting.updated');
  }

  async update(id: number, autorouting: Autorouting): Promise<void> {
    await this.autoroutingsRepository.update(id, autorouting);
    this.eventEmitter.emit('autorouting.updated');
  }

  async remove(id: number): Promise<void> {
    await this.autoroutingsRepository.delete(id);
    this.eventEmitter.emit('autorouting.updated');
  }

  async enable(id: number): Promise<void> {
    const autorouting = await this.findOneOrFail(id);
    autorouting.Activated = true;
    await this.update(id, autorouting);
  }

  async disable(id: number): Promise<void> {
    const autorouting = await this.findOneOrFail(id);
    autorouting.Activated = false;
    await this.update(id, autorouting);
  }
}
