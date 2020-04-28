// todo: need a proper setup for env variables for jest
// hacky e2e atm:
// start debug `Launch Program-TEST`
// use the same test database as in .env-test
// run `$ npm run test:e2e`
process.env.DB = 'mongodb://localhost/ecommerce-test';

import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { RegisterDTO, LoginDTO } from '../src/auth/auth.dto';
import * as mongoose from 'mongoose';

const app = 'http://localhost:3000';

beforeAll(async () => {
  await mongoose.connect(process.env.DB);
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('ROOT', () => {
  it('shoold ping / (GET)', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

describe('AUTH', () => {
  it('should register', () => {
    const user: RegisterDTO = {
      username: 'username',
      password: 'password'
    };

    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('username');
        expect(body.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED)
  });

  it('should reject duplicate registration', () => {
    const user: RegisterDTO = {
      username: 'username',
      password: 'password'
    };

    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.message).toEqual('User already exists');
        expect(body.statusCode).toEqual(400);
      })
      .expect(HttpStatus.BAD_REQUEST)
  });

  it('should login', () => {
    const user: LoginDTO = {
      username: 'username',
      password: 'password'
    };

    return request(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('username');
        expect(body.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED)
  })
});
