import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class RoleDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  name: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  import: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  anonymize: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  export: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  query: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  autoQuery: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  delete: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  admin: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  modify: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  cdBurner: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  autoRouting: boolean;
}
