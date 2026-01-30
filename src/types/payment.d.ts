import { Decimal } from "@prisma/client/runtime/library";

export interface PaymentCreateRequest {
  orderId: number;
  method: PaymentMethod;
  amount: Decimal;
}