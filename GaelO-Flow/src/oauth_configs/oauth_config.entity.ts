import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OauthConfig {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ name: 'id' })
  Id: number;

  @ApiProperty({ example: 'keycloak' })
  @Column()
  Provider: string;

  @ApiProperty({
    example: 'http://localhost:8080/realms/master/protocol/openid-connect/auth',
  })
  @Column()
  AuthorizationUrl: string;
}
