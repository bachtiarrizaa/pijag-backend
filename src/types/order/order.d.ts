export interface CreateOrder {
  customer_id?: number | null;
  cashier_id?: number | null;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
}