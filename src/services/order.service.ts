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

export class OrderService {
  static async create(cashierId: number | null, payload: CreateOrderRequest) {
    try {
      const source = cashierId ? OrderSource.cashier : OrderSource.customer;

      if (source === OrderSource.cashier && cashierId !== null) {
        const activeShift = await ShiftRepository.findOpenShift(cashierId);
        if (!activeShift) throw new ErrorHandler(403, "Cashier has no active shift");
      }

      if (source === OrderSource.customer && !payload.customerId) {
        throw new ErrorHandler(400, "customerId is required for customer order");
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
    }
  }
}

