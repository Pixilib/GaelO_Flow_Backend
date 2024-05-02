import * as request from 'supertest';

async function loginAsAdmin(server: any) {
  const response = await request(server).post('/login').send({
    Email: 'admin@gaelo.com',
    Password: 'passwordadmin',
  });

  return response.body;
}

async function loginAsUser(server: any) {
  const response = await request(server).post('/login').send({
    Email: 'user@gaelo.com',
    Password: 'passworduser',
  });

  return response.body;
}

export { loginAsAdmin, loginAsUser };
