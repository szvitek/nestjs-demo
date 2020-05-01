// todo: need a proper setup for env variables for jest
// hacky e2e atm:
// start debug `Launch Program-TEST`
// use the same test database as in .env-test
// run `$ npm run test:e2e`
process.env.DB = 'mongodb://localhost/ecommerce-test';
process.env.PORT = '3000';

import * as request from 'supertest';
import { app } from './constants';

describe('ROOT', () => {
  it('shoold ping / (GET)', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
