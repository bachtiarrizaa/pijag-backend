import { Decimal } from "@prisma/client/runtime/library";
import { OrderRepository } from "../repositories/order.repository";
import { PaymentRepository } from "../repositories/payment.repository";
import { PaymentCreateRequest } from "../types/payment";
import { ErrorHandler } from "../utils/error.utils";
import { TransactionRepository } from "../repositories/transaction.repository";
import { ShiftRepository } from "../repositories/shift.repository";

export class PaymentService {
  static async create(user: any, payload: PaymentCreateRequest) {
    const order = await OrderRepository.findOrderById(payload.orderId);
    if (!order) {
      throw new ErrorHandler(404, "Order not found");
    }

    if (order.paymentStatus === "paid") {
      throw new ErrorHandler(400, "Order already paid");
    }

    if (order.status === "canceled") {
      throw new ErrorHandler(400, "Order has been canceled");
    }

    const orderTotal = order.finalTotal;
    const paidAmount = new Decimal(payload.amount)

    if (paidAmount.lessThan(orderTotal)) {
      throw new ErrorHandler(400, "Payment amount is less than order total");
    }

    const change = paidAmount.minus(orderTotal);

    const paymentData = {
      orderId: payload.orderId,
      method: payload.method,
      amount: orderTotal
    }

    const payment = await PaymentRepository.create(paymentData);

    await OrderRepository.updateStatus(order.id, {
      status: "processing",
      paymentStatus: "paid",
    });

    let transaction = null;
    let activeShiftId = null;

    if (order.cashierId) {
      const activeShift = await ShiftRepository.findOpenShift(order.cashierId);
      if (activeShift) {
        activeShiftId = activeShift.id;
      }
    }

    transaction = await TransactionRepository.create({
      shiftId: activeShiftId,
      orderId: order.id,
      paymentId: payment.id,
      type: "income",
      amount: orderTotal,
      description: `Payment for order ${order.orderCode} (${order.source})`
    });

    return {
      ...payment,
      orderId: order.id,
      paidAmount,
      change,
      transaction,
    };
  }
}