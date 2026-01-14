import { OrderSource } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { OrderItemRequest } from "./order-item.";

export interface CreateOrderRequest {
  customerId?: number | null;
  cashierId?: number | null;
  orderCode: string,
  source: OrderSource,
  total: Decimal,
  finalTotal: Decimal,
  items: OrderItemRequest[];
}