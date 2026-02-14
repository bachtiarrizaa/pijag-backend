import { OrderSource } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../config/prisma.config";
import { CreateOrderRequest } from "../types/order";
import { OrderRepository } from "../repositories/order.repository";
import { OrderItemRepository } from "../repositories/order-iitem.repository";
import { ProductRepository } from "../repositories/product.repository";
import { DiscountUtils } from "../utils/discount.utils";
import { OrderUtils } from "../utils/order.utils";
import { ShiftRepository } from "../repositories/shift.repository";
import { ErrorHandler } from "../utils/error.utils";
import { OrderItemRequest } from "../types/order-item.";
import { CustomerRepository } from "../repositories/customer.repository";
import dayjs from "dayjs";
import { PaginateUtils } from "../utils/pagination.utils";
import { PaginationQuery } from "../types/pagination";

export class OrderService {
  static async getOrders(user: any, query: PaginationQuery) {
    const { page, limit, offset } = PaginateUtils.paginate(query);

    let orders, totalItems;

    if (user.roleName === "customer") {
      const customer = await CustomerRepository.findByUserId(user.id);
      if (!customer) throw new ErrorHandler(404, "Customer not found");

      [orders, totalItems] = await Promise.all([
        OrderRepository.findOrdersByCustomer(customer.id, offset, limit),
        OrderRepository.count(customer.id)
      ]);
    } else if (user.roleName === "admin" || user.roleName === "cashier") {
      [orders, totalItems] = await Promise.all([
        OrderRepository.findOrders(offset, limit),
        OrderRepository.count()
      ]);
    } else {
      throw new ErrorHandler(403, "Forbidden");
    }

    const meta = PaginateUtils.buildMeta({
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
      itemCount: orders.length
    });

    return { orders, meta };
  }

  static async create(cashierId: number | null, payload: CreateOrderRequest) {
    try {
      const source = cashierId ? OrderSource.cashier : OrderSource.customer;

      if (source === OrderSource.cashier && cashierId !== null) {
        const activeShift = await ShiftRepository.findOpenShift(cashierId);
        if (!activeShift) {
          throw new ErrorHandler(403, "Cashier has no active shift");
        }
      }
      
      if (source === OrderSource.customer && !payload.customerId) {
        throw new ErrorHandler(400, "customerId is required for customer order");
      }

      if (payload.customerId) {
        const customer = await CustomerRepository.findByCustomerId(payload.customerId);
        if (!customer) {
          throw new ErrorHandler(404, `Customer with id ${payload.customerId} not found`);
        }
      }

      if (!payload.items || payload.items.length === 0) {
        throw new ErrorHandler(400, "Items cannot be empty");
      }

      const orderCode = await OrderUtils.generateOrderCode(source);

      return await prisma.$transaction(async (tx) => {
        let total = new Decimal(0);
        const validatedItems: OrderItemRequest[] = [];

        for (const item of payload.items) {
          const product = await ProductRepository.findProductById(item.productId);
          if (!product) throw new ErrorHandler(404, "Product not found");

          if (product.stock < item.quantity) {
            throw new ErrorHandler(400, `Stock not enough for product ${item.productId}`);
          }

          const pricedProduct = DiscountUtils.calculateDiscount(product);
          const finalPrice = pricedProduct.finalPrice;
          const subtotal = finalPrice.mul(item.quantity);

          total = total.add(subtotal);

          validatedItems.push({
            productId: product.id,
            quantity: item.quantity,
            price: finalPrice,
            subtotal
          });

          await ProductRepository.decrementStock(product.id, item.quantity, tx);
        }

        const itemData = {
          customerId: payload.customerId ?? null,
          cashierId: cashierId ?? null,
          orderCode,
          source,
          total,
          finalTotal: total,
          items: validatedItems
        }
        const order = await OrderRepository.create(itemData, tx);

        await OrderItemRepository.createMany(validatedItems, order.id, tx);

        return {
          ...order,
          items: validatedItems,
        };
      });
    } catch (error) {
      throw error;
    };
  };

  static async autoCancelOrder() {
    try {
      const expiredTime = dayjs().subtract(5, "minute").toDate();

      return await prisma.$transaction(async (tx) => {
        const expiredOrders = await OrderRepository.findOrderPendingStatus(expiredTime, tx)

        if (expiredOrders.length === 0) {
          return {
            canceledCount: 0,
            message: "No expired orders found",
          };
        };

        for (const order of expiredOrders) {
          for (const item of order.orderItems) {
            await ProductRepository.incrementStock(item.productId, item.quantity, tx)
          }

          await OrderRepository.cancelOrder(order.id, tx)
        }

        return {
          canceledCount: expiredOrders.length,
          message: "Expired orders successfully canceled",
        };
      })
    } catch (error) {
      throw error;
    };
  };
}

