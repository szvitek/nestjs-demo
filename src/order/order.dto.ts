interface ProductOrderDTO {
  product: string;
  quantity: number;
}

export class CreateOrderDTO {
  products: ProductOrderDTO[];
}
