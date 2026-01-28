export interface OrderItemRequest {
  productId: number;
  quantity: number;
  price: Decimal,
  subtotal: Decimal
}