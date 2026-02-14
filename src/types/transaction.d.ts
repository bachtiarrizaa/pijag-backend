import { TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface TransactionCreateRequest {
  shiftId?: number | null;
  orderId: number;
  paymentId: number;
  type: TransactionType;
  amount: Decimal;
  description?: string | null;
}