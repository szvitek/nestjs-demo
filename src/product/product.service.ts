import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/types/product';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';
import { User } from '../types/user';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) {}

  async findAll() {
    return this.productModel.find().populate('owner');
  }

  async findByOwner(userId: string) {
    // got a TS errro here, so I updated the user prop in Product types to User | string, now it works
    return this.productModel.find({ owner: userId }).populate('owner');
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).populate('owner');
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NO_CONTENT);
    }
    return product;
  }

  async create(productDTO: CreateProductDTO, user: User) {
    const product = await this.productModel.create({
      ...productDTO,
      owner: user,
    });
    await product.save();
    // return product.populate('owner); // doesn't work like this
    return this.productModel.findById(product._id).populate('owner');
  }

  async update(id: string, productDTO: UpdateProductDTO, userId: string) {
    const product = await this.productModel.findById(id); // why not findOneAndUpdate
    if (userId !== product.owner.toString()) {
      throw new UnauthorizedException('You do not own thos product');
    }
    await product.update(productDTO);
    return this.productModel.findById(id).populate('owner');
  }

  async delete(id: string, userId: string) {
    const product = await this.productModel.findById(id);
    if (userId !== product.owner.toString()) {
      throw new UnauthorizedException('You do not own thos product');
    }
    await product.remove();
    return product.populate('owner');
  }
}
