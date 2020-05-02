import { Schema, Types } from 'mongoose';

export const ProductSchema = new Schema({
  owner: {
    type: Types.ObjectId,
    ref: 'User',
  },
  title: String,
  description: String,
  image: String,
  price: Number,
  created: {
    type: Date,
    default: Date.now,
  },
});
