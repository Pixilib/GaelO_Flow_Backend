import { OmitType } from '@nestjs/swagger';
import { Autorouting } from '../autorouting.entity';

export class CreateAutoroutingDto extends OmitType(Autorouting, [
  'Id',
] as const) {}
