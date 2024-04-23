import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOptionDto } from './create-option.dto';
import { IsString } from 'class-validator';

export class GetOptionDto extends PartialType(CreateOptionDto) {
  @ApiProperty({ example: '<ORTHANC_ADDRESS>' })
  @IsString()
  OrthancAddress: string;

  @ApiProperty({ example: '<ORTHANC_PORT>' })
  @IsString()
  OrthancPort: string;

  @ApiProperty({ example: '<ORTHANC_USERNAME>' })
  @IsString()
  OrthancUsername: string;

  @ApiProperty({ example: '<ORTHANC_PASSWORD>' })
  @IsString()
  OrthancPassword: string;

  @ApiProperty({ example: '<REDIS_ADDRESS>' })
  @IsString()
  RedisAddress: string;

  @ApiProperty({ example: '<REDIS_PORT>' })
  @IsString()
  RedisPort: string;
}
