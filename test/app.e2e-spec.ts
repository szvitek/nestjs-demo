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
