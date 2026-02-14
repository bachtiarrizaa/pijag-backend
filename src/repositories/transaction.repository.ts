import prisma from "../config/prisma.config";
import { TransactionCreateRequest } from "../types/transaction";

export class TransactionRepository {
  static async create(payload: TransactionCreateRequest) {
    const transaction = await prisma.transaction.create({
      data: {
        shiftId: payload.shiftId ?? null,
        orderId: payload.orderId,
        paymentId: payload.paymentId,
        type: payload.type,
        amount: payload.amount,
        description: payload.description ?? null
      }
    });
    return transaction;
  }

  static async findByShift(shiftId: number) {
    const transactions = await prisma.transaction.findMany({
      where: { shiftId },
      include: {
        order: true,
        payment: true
      },
      orderBy: { createdAt: "desc" }
    });
    return transactions;
  }

  static async findByOrder(orderId: number) {
    const transactions = await prisma.transaction.findMany({
      where: { orderId },
      include: {
        shift: true,
        payment: true
      }
    });
    return transactions;
  }
}
