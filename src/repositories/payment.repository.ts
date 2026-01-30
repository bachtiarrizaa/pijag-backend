import prisma from "../config/prisma.config";
import { PaymentCreateRequest } from "../types/payment";

export class PaymentRepository {
  static async create(payload: PaymentCreateRequest) {
    try {
      const payment = await prisma.payment.create({
        data: {
          orderId: payload.orderId,
          method: payload.method,
          amount: payload.amount,
          status: "success",
          transactionTime: new Date()
        }
      });
      return payment;
    } catch (error) {
      throw error;
    };
  };
}