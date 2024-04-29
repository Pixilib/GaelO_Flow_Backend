import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsString, ValidateNested } from 'class-validator';
import {
  AutoroutingEventType,
  Condition,
  DestinationType,
  DicomTag,
  RuleCondition,
  ValueRepresentation,
} from './autorouting.enum';
import { Type } from 'class-transformer';

export class Rule {
  @ApiProperty({ example: DicomTag.PATIENT_NAME })
  @Column({ name: 'dicom_tag' })
  @IsEnum(DicomTag)
  DicomTag: DicomTag;

  @ApiProperty({ example: ValueRepresentation.STRING })
  @Column({ name: 'value_representation' })
  @IsEnum(ValueRepresentation)
  ValueRepresentation: ValueRepresentation;

  @ApiProperty()
  @Column({ name: 'value' })
  // TODO: VALIDATOR ?
  @IsString()
  Value: string | number;

  @ApiProperty({ example: Condition.EQUALS })
  @Column({ name: 'condition' })
  @IsEnum(Condition)
  Condition: Condition;
}

export class Destination {
  @ApiProperty({ example: DestinationType.AET })
  @Column({ name: 'type' })
  @IsEnum(DestinationType)
  Destination: DestinationType;

  @ApiProperty()
  @Column({ name: 'name' })
  @IsString()
  Name: string;
}

export class Router {
  @ApiProperty({ example: RuleCondition.AND })
  @Column({ name: 'rule_condition' })
  @IsEnum(RuleCondition)
  RuleCondition: RuleCondition;

  @ApiProperty({
    example: [
      {
        DicomTag: DicomTag.PATIENT_NAME,
        ValueRepresentation: ValueRepresentation.STRING,
        Value: 'value',
        Condition: Condition.EQUALS,
      },
    ],
  })
  @Column({ name: 'rules', type: 'jsonb' })
  @ValidateNested({ each: true })
  @Type(() => Rule)
  Rules: Rule[];

  @ApiProperty({
    example: [
      {
        Destination: DestinationType.AET,
        Name: 'value',
      },
    ],
  })
  @Column({ name: 'destinations', type: 'jsonb' })
  @ValidateNested({ each: true })
  @Type(() => Destination)
  Destinations: Destination[];
}

@Entity()
export class Autorouting {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  Id?: number;

  @ApiProperty()
  @Column({ name: 'name' })
  @IsString()
  Name: string;

  @ApiProperty({ example: AutoroutingEventType.NEW_INSTANCE })
  @Column({ name: 'event_type' })
  @IsEnum(AutoroutingEventType)
  EventType: AutoroutingEventType;

  @ApiProperty()
  @Column({ name: 'activated' })
  @IsBoolean()
  Activated: boolean;

  @ApiProperty()
  @Column({ name: 'router', type: 'jsonb' })
  @ValidateNested()
  @Type(() => Router)
  Router: Router;
}
