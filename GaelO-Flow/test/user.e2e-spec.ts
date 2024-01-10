import { Test, TestingModule } from '@nestjs/testing';
import { NestApplication } from '@nestjs/core';
import { User } from './../src/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../src/users/users.service';
import { UsersController } from '../src/users/users.controller';
import { Role } from '../src/roles/role.entity';
import * as bcryptjs from 'bcryptjs';
import * as request from 'supertest';
import { RolesService } from '../src/roles/roles.service';

describe('UserController (e2e)', () => {
  let app: NestApplication;
  let saltTest: string;
  let hashTest: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Role],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Role]),
      ],
      controllers: [UsersController],
      providers: [UsersService, RolesService],
    }).compile();

    const usersService = module.get<UsersService>(UsersService);
    const rolesService = module.get<RolesService>(RolesService);

    const role = new Role();
    role.name = 'User';

    saltTest = await bcryptjs.genSalt();
    hashTest = await bcryptjs.hash('testPassword123!', saltTest);

    await rolesService.create(role);

    await usersService.create({
      username: 'testuser',
      firstname: 'testfirstname',
      lastname: 'testlastname',
      email: 'testuser@example.com',
      password: hashTest,
      super_admin: false,
      role_name: role.name,
      salt: saltTest,
    });

    app = module.createNestApplication();
    await app.init();
  });

  it('should get all users', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .then((response) => {
        console.log(response.body);

        // check if the response is an array
        expect(Array.isArray(response.body)).toBeTruthy();

        // check if the response is an array of size 1
        expect(response.body.length).toBe(1);

        // check if the response is an array of objects with 9 properties
        // expect(Object.keys(response.body[0])).toEqual(9);

        // check if the response is an array of objects with the following properties
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('firstname');
        expect(response.body[0]).toHaveProperty('lastname');
        expect(response.body[0]).toHaveProperty('username');
        expect(response.body[0]).toHaveProperty('password');
        expect(response.body[0]).toHaveProperty('email');
        expect(response.body[0]).toHaveProperty('super_admin');
        expect(response.body[0]).toHaveProperty('salt');

        // check if the response is an array of objects with the following values
        expect(response.body[0].id).toBe(1);
        expect(response.body[0].firstname).toBe('testfirstname');
        expect(response.body[0].lastname).toBe('testlastname');
        expect(response.body[0].username).toBe('testuser');
        expect(response.body[0].password).toBe(hashTest);
        expect(response.body[0].email).toBe('testuser@example.com');
        expect(response.body[0].super_admin).toBe(false);
        expect(response.body[0].salt).toBe(saltTest);
      });
  });
});
