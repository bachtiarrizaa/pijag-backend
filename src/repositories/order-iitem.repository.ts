import { Prisma } from "@prisma/client";
import { OrderItemRequest } from "../types/order-item.";

export class OrderItemRepository {
  static async createMany(
    payload: OrderItemRequest[],
    orderId: number,
    tx: Prisma.TransactionClient
  ) {
    try {
      const orderItemsData = payload.map(item => ({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      }));

      const order = await tx.orderItem.createMany({
        data: orderItemsData
      });
      return order;
    } catch (error) {
      throw error;
    };
  }
}