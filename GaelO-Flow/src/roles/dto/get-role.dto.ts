import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { Label } from '../../labels/label.entity';

export class GetRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({ required: false, default: null })
  Labels?: Label[];
}
