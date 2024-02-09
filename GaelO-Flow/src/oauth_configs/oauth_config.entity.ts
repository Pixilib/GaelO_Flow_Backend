import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OauthConfig {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ example: 'keycloak' })
  @Column()
  provider: string;

  @ApiProperty({
    example: 'http://localhost:8080/realms/master/protocol/openid-connect/auth',
  })
  @Column()
  url: string;

  @ApiProperty({
    example: 'https://www.keycloak.org/resources/images/logo.svg',
  })
  @Column({ nullable: true })
  logo: string;
}
