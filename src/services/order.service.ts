import { OrderSource } from "@prisma/client";
import { CreateOrderRequest, OrderItemRequest } from "../types/order";
import { ShiftRepository } from "../repositories/shift.repository";
import { ErrorHandler } from "../utils/error.utils";
import { OrderUtils } from "../utils/order.utils";
import { Decimal } from "@prisma/client/runtime/library";
import { ProductRepository } from "../repositories/product.repository";
import { DiscountUtils } from "../utils/discount.utils";
import prisma from "../config/prisma.config";

export class OrderService {
  static async create(cashierId: number | null, payload: CreateOrderRequest) {
    try {
      let source: OrderSource;
      if(cashierId) {
        source = OrderSource.cashier;
      } else {
        source = OrderSource.customer;
      }

      if (source === OrderSource.cashier && cashierId !== null) {
        const activeShift = await ShiftRepository.findOpenShift(cashierId);
        if (!activeShift) {
          throw new ErrorHandler(403, "Cashier has no active shift");
        };
      }

      if (source === OrderSource.customer) {
        if (!payload.customerId) {
          throw new ErrorHandler(400, "customerId is required for customer order");
        }
      }

      if (!payload.items || payload.items.length === 0) {
        throw new ErrorHandler(400, "Items cannot be empty");
      };

      const orderCode = await OrderUtils.generateOrderCode(source);
      let total = new Decimal(0);

      const validatedItems = await Promise.all(
        payload.items.map( async(item: OrderItemRequest) => {
          const product = await ProductRepository.findProductById(item.productId);
          if (!product) {
            throw new ErrorHandler(404, "Product not found");
          };

          const pricedProduct = DiscountUtils.calculateDiscount(product);
          const finalPrice = pricedProduct.finalPrice;
          const subtotal = finalPrice.mul(item.quantity);

          total = total.add(subtotal);

          return {
            productId: pricedProduct.id,
            quantity: item.quantity,
            price: finalPrice,
            subtotal
          };
        })
      );

      const createdOrder = await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            customerId: payload.customerId || null,
            cashierId: cashierId || null,
            orderCode: orderCode,
            source,
            total,
            finalTotal: total
          }
        });

        const orderItemData = validatedItems.map(item => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }));

        await tx.orderItem.createMany({
          data: orderItemData
        });

        return order;
      });

      return {
        order: createdOrder,
        items: validatedItems,
        total
      };
    } catch (error) {
      throw error;
    };
  };
}