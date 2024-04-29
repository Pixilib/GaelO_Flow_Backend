import * as request from 'supertest';

async function loginAsAdmin(server: any) {
  const response = await request(server).post('/login').send({
    Username: 'admin',
    Password: 'passwordadmin',
  });

  return response.body;
}

async function loginAsUser(server: any) {
  const response = await request(server).post('/login').send({
    Username: 'user',
    Password: 'passworduser',
  });

  return response.body;
}

export { loginAsAdmin, loginAsUser };
