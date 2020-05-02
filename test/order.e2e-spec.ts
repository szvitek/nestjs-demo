import * as mongoose from 'mongoose';
import axios from 'axios';
import * as request from 'supertest';
import { app } from './constants';
import { RegisterDTO } from 'src/auth/auth.dto';
import { CreateProductDTO } from 'src/product/product.dto';
import { HttpStatus } from '@nestjs/common';
import { Product } from '../src/types/product';

let sellerToken: string;
let buyerToken: string;
let boughtProducts: Product[];
const orderBuyer: RegisterDTO = {
  seller: false,
  username: 'orderbuyer',
  password: 'password',
};
const orderSeller: RegisterDTO = {
  username: 'productSeller',
  password: 'password',
  seller: true,
};
const soldProducts: CreateProductDTO[] = [
  { title: 'newer phone', image: 'n/a', description: 'description', price: 10 },
  {
    title: 'newest phone',
    image: 'n/a',
    description: 'description',
    price: 20,
  },
];

beforeAll(async () => {
  await mongoose.connect(process.env.DB);
  await mongoose.connection.db.dropDatabase();

  ({
    data: { token: sellerToken },
  } = await axios.post(`${app}/auth/register`, orderSeller));

  ({
    data: { token: buyerToken },
  } = await axios.post(`${app}/auth/register`, orderBuyer));

  const [{ data: data1 }, { data: data2 }] = await Promise.all(
    soldProducts.map(product =>
      axios.post(`${app}/product`, product, {
        headers: { authorization: `Bearer ${sellerToken}` },
      }),
    ),
  );

  boughtProducts = [data1, data2];
  console.log(boughtProducts);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('ORDER', () => {
  it('should create order of all products', async () => {
    const orderDTO = {
      products: boughtProducts.map(product => ({
        product: product._id,
        quantity: 1,
      })),
    };

    return request(app)
      .post('/order')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send(orderDTO)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body.owner.username).toEqual(orderBuyer.username);
        expect(body.products.length).toEqual(boughtProducts.length);
        expect(
          boughtProducts
            .map(product => product._id)
            .includes(body.products[0]._id),
        ).toBeTruthy();
        expect(body.totalPrice).toEqual(
          boughtProducts.reduce((acc, product) => acc + product.price, 0),
        );
      });
  });

  it('should list all orders of buyer', () => {
    return request(app)
      .get('/order')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body.length).toEqual(1);
        expect(body[0].products.length).toEqual(boughtProducts.length);
        expect(
          boughtProducts
            .map(product => product._id)
            .includes(body[0].products[0]._id),
        ).toBeTruthy();
      });
  });

  // it('should process payment', () => { });
});
