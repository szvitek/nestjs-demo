import { Document } from 'mongoose';
import { User } from './user';

export interface Product extends Document {
  owner: User | string;
  title: string;
  description: string;
  image: string;
  price: number;
  created: Date;
}
