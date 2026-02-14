import { OrderSource, Prisma } from "@prisma/client";
import prisma from "../config/prisma.config";
import dayjs from "dayjs";
import { CreateOrderRequest, UpdateStatusOrderRequest } from "../types/order";

export class OrderRepository {
  static async findLastOrderBySource(date: string, source: OrderSource) {
    try {
      const lastOrderCode = await prisma.order.findFirst({
        where: {
          createdAt: {
            gte: dayjs(date, "YYYYMMDD").startOf("day").toDate(),
            lte: dayjs(date, "YYYYMMDD").endOf("day").toDate(),
          },
          source,
        },
        orderBy: { id: "desc" },
      });
      return lastOrderCode;
    } catch (error) {
      throw error;
    };
  };

  static async findOrdersByCustomer(customerId: number, skip: number, take: number) {
    return prisma.order.findMany({
      where: { customerId },
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: { product: true }
        }
      }
    });
  }

  static async findOrders(skip: number, take: number) {
    return prisma.order.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: { product: true }
        }
      }
    });
  }

  static async count(customerId?: number) {
    return prisma.order.count({
      where: customerId ? { customerId } : {}
    });
  }


  static async findOrderById(orderId: number) {
    try {
      const order = await prisma.order.findFirst({
        where: { id: orderId },
      });
      return order;
    } catch (error) {
      throw error;
    };
  };

  static async findOrderPendingStatus(expiredTime: Date, tx: Prisma.TransactionClient) {
    try {
      const order = await tx.order.findMany({
        where: {
          status: "pending",
          paymentStatus: "pending",
          createdAt: { lte: expiredTime }
        },
        include: {
          orderItems: true
        }
      });
      return order;
    } catch (error) {
      throw error;
    };
  };

  static async create(
    payload: CreateOrderRequest,
    tx: Prisma.TransactionClient
  ) {
    try {
      const order = await tx.order.create({
        data: {
          customerId: payload.customerId ?? null,
          cashierId: payload.cashierId ?? null,
          orderCode: payload.orderCode,
          source: payload.source,
          total: payload.total,
          finalTotal: payload.finalTotal,
          voucherId: payload.voucherId ?? null
        }
      });
      return order;
    } catch (error) {
      throw error;
    };
  };

  static async updateStatus(orderId: number, payload: UpdateStatusOrderRequest) {
    try {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: payload.status,
          paymentStatus: payload.paymentStatus
        }
      });
      return order;
    } catch (error) {
      throw error;
    };
  };

  static async cancelOrder(orderId: number, tx: Prisma.TransactionClient) {
    try {
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status: "canceled",
          paymentStatus: "failed"
        }
      });
      return order;
    } catch (error) {
      throw error;
    };
  };
}
