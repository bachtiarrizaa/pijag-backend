import { OrderSource } from "@prisma/client";
import prisma from "../config/prisma.config";
import dayjs from "dayjs";

export class OrderRepository {
  static async findLastOrderBySource(
    date: string,
    source: OrderSource
  ) {
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
}
