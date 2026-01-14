export interface CreateOrderRequest {
  customerId?: number | null;
  cashierId?: number | null;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}