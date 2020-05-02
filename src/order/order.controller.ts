import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../utils/user.decorator';
import { User as UserDocument } from '../types/user';
import { CreateOrderDTO } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(private orderServide: OrderService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  listOrder(@User() { _id }: UserDocument) {
    return this.orderServide.listOdersByUser(_id.toString());
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createOrder(
    @Body() order: CreateOrderDTO,
    @User() { _id }: UserDocument,
  ) {
    return await this.orderServide.createOrder(order, _id.toString());
  }
}
