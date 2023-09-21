import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthentificationController } from './controllers/authentification';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Role } from './roles/role.entity'


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'gaelo-flow',
      entities: [User, Role],
      synchronize: true,
    }),
  ],
  controllers: [AppController, AuthentificationController],
  providers: [AppService],
})
export class AppModule {}
