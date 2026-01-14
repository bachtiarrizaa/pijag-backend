import dayjs from "dayjs";
import { Request } from "express";
import { CreateOrderRequest } from "../types/order";
import { CustomerRepository } from "../repositories/customer.repository";
import { ErrorHandler } from "./error.utils";
import { OrderRepository } from "../repositories/order.repository";

export class OrderUtils {
  static async generateOrderCode(source: "customer" | "cashier"): Promise<string> {
    try {
      const prefix = source === "cashier" ? "1" : "2";
      const date = dayjs().format("YYYYMMDD");

      const lastOrderToday = await OrderRepository.findLastOrderBySource(date, source)

      let nextNumber = 1;

      if (lastOrderToday?.orderCode) {
        const parts = lastOrderToday.orderCode.split("-");
        const numberPart = parts[1]?.slice(1) ?? "0";
        nextNumber = parseInt(numberPart, 10) + 1;
      }

      const numberStr = nextNumber.toString().padStart(5, "0");

      return `${date}-${prefix}${numberStr}`;
    } catch (error) {
      throw error;
    }
  }

  static async orderContext(req: Request) {
    try {
      const payload = req.body as CreateOrderRequest;
      let cashierId: number | null = null;

      const role = req.user?.roleName;

      switch(role) {
        case "customer": {
          const customer = await CustomerRepository.findByUserId(req.user?.id)
          if (!customer) {
            throw new ErrorHandler(400, "Customer not found");
          }

          payload.customerId = customer.id;
          break;
        }

        case "cashier": {
          cashierId = req.user?.id;
          break;
        }
      }

      return { cashierId, payload }
    } catch (error) {
      throw error;
    }
  }
}