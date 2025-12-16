export interface CreateOrder {
  customer_id?: number | null;
  cashier_id?: number | null;
  items: OrderItem[];
}

export interface OrderItem {
  product_id: number;
  quantity: number;
}