import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../config/prisma.config";
import { OrderItemRequest } from "../types/order-item.";


export class OrderItemRepository {
  static async createMany(
    payload: OrderItemRequest[],
    orderId: number,
    tx: Prisma.TransactionClient | PrismaClient
  ) {
    try {
      const client = tx || prisma;

      const orderItemsData = payload.map(item => ({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      }));

      const orderItems = await client.orderItem.createMany({
        data: orderItemsData
      });

      return orderItems;
    } catch (error) {
      throw error;
    };
  };
}