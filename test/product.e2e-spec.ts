import * as mongoose from 'mongoose';
import axios from 'axios';
import * as request from 'supertest';
import { app } from './constants';
import { RegisterDTO } from 'src/auth/auth.dto';
import { CreateProductDTO } from 'src/product/product.dto';
import { HttpStatus } from '@nestjs/common';

let sellerToken: string;
const productSeller: RegisterDTO = {
  username: 'productSeller',
  password: 'password',
  seller: true,
};

beforeAll(async () => {
  await mongoose.connect(process.env.DB);
  await mongoose.connection.db.dropDatabase();

  const {
    data: { token },
  } = await axios.post(`${app}/auth/register`, productSeller);
  sellerToken = token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('PRODUCT', () => {
  const product: CreateProductDTO = {
    title: 'test product',
    description: 'test product description',
    image: 'n/a',
    price: 10,
  };
  let productId: string;

  it('should list all products', () => {
    return request(app)
      .get('/product')
      .expect(200);
  });

  it('should list my products', () => {
    return request(app)
      .get('/product/mine')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(200);
  });

  it('should create product', () => {
    return request(app)
      .post('/product')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send(product)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body._id).toBeDefined();
        productId = body._id;
        expect(body.title).toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.image).toEqual(product.image);
        expect(body.price).toEqual(product.price);
        expect(body.owner.username).toEqual(productSeller.username);
      });
  });

  it('should read product', () => {
    return request(app)
      .get(`/product/${productId}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body._id).toEqual(productId);
        expect(body.title).toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.image).toEqual(product.image);
        expect(body.price).toEqual(product.price);
        expect(body.owner.username).toEqual(productSeller.username);
      });
  });

  it('should update product', () => {
    return request(app)
      .put(`/product/${productId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ title: 'updated title' })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body._id).toEqual(productId);
        expect(body.title).not.toEqual(product.title);
        expect(body.title).toEqual('updated title');
        expect(body.description).toEqual(product.description);
        expect(body.image).toEqual(product.image);
        expect(body.price).toEqual(product.price);
        expect(body.owner.username).toEqual(productSeller.username);
      });
  });

  it('should delete product', async () => {
    await axios.delete(`${app}/product/${productId}`, {
      headers: { Authorization: `Bearer ${sellerToken}` },
    });

    return request(app)
      .get(`/product/${productId}`)
      .expect(HttpStatus.NO_CONTENT);
  });
});
