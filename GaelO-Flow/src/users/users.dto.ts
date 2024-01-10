import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class UserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstname: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastname: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'myPassw0rd' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'john.doe@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  superAdmin: boolean;

  @ApiProperty({ example: 'admin' })
  @IsString()
  roleName: string;
} // TODO: decorators
