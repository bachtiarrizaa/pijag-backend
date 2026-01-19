import { OrderSource } from "@prisma/client";
import prisma from "../config/prisma.config";
import dayjs from "dayjs";
import { CreateOrderRequest } from "../types/order";
import { OrderItemRepository } from "./order-iitem.repository";
import { ErrorHandler } from "../utils/error.utils";
import { ProductRepository } from "./product.repository";

export class OrderRepository {
  static async findLastOrderBySource( date: string, source: OrderSource ) {
    return prisma.order.findFirst({
      where: {
        createdAt: {
          gte: dayjs(date, "YYYYMMDD").startOf("day").toDate(),
          lte: dayjs(date, "YYYYMMDD").endOf("day").toDate(),
        },
        source,
      },
      orderBy: { id: "desc" },
    });
  }

  static async create(payload: CreateOrderRequest) {
    try {
      return await prisma.$transaction(async (tx) => {

        for (const item of payload.items) {
          await ProductRepository.checkStock(
            item.productId,
            item.quantity,
            tx
          )
        }

        const order = await tx.order.create({
          data: {
            customerId: payload.customerId ?? null,
            cashierId: payload.cashierId ?? null,
            orderCode: payload.orderCode,
            source: payload.source,
            total: payload.total,
            finalTotal: payload.finalTotal
          }
        });
        
        await OrderItemRepository.createMany(
          payload.items,
          order.id,
          tx
        );

        for (const item of payload.items) {
          await ProductRepository.decrementStock(
            item.productId,
            item.quantity,
            tx
          )
        }

        return order;
      })
    } catch (error) {
      throw error;
    };
  };
}
