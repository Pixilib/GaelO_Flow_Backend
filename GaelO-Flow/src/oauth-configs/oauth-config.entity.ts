import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class OauthConfig {
  @ApiProperty({ example: 'keycloak' })
  @PrimaryColumn({ name: 'id' })
  Name: string;

  @ApiProperty({ example: 'keycloak' })
  @Column()
  Provider: string;

  @ApiProperty({
    example: 'http://localhost:8080/realms/master/protocol/openid-connect/auth',
  })
  @Column()
  AuthorizationUrl: string;

  @ApiProperty({ example: 'back-end' })
  @Column()
  ClientId: string;
}
