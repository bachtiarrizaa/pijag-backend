import { OrderSource } from "@prisma/client";
import { CreateOrder, OrderItem } from "../../types/order/order";
import { generateOrderCode } from "../../utils/generate.order.code";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../../config/prisma.config";

export const createOrderService = async(cashier_id: number | null, payload: CreateOrder) => {
  const { customer_id, items } = payload;

  let source: OrderSource
  if (cashier_id) {
    source = OrderSource.cashier;
  } else {
    source = OrderSource.customer;
  }

  if (source === OrderSource.cashier) {
    const activeShift = await prisma.shift.findFirst({
      where: {
        user_id: cashier_id!,
        status: "open",
      },
    });

    if (!activeShift) {
    const error: any = new Error("Cashier has no active shift");
    error.statusCode = 403;
    throw error;
  }
  }

  if (source === OrderSource.customer) {
    if (!customer_id || customer_id == null) {
      const error: any = new Error("customer_id is required for customer order");
      error.statusCode = 400;
      throw error;
    }
  }

  if (!items || items.length === 0) {
    const error: any = new Error("Items cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  const order_code = generateOrderCode(source);

  let total = new Decimal(0);

  const validatedItems = await Promise.all(
    items.map( async (item: OrderItem) => {
      const product = await prisma.product.findUnique({
        where: { id: (item.product_id)},
      });

      if (!product) {
        throw { statusCode: 404, message: `Product not found: ${item.product_id}` };
      }

      const quantity = Number(item.quantity);
      const subtotal = product.price.mul(quantity);
      total = total.add(subtotal);

      return {
        product_id: (item.product_id),
        quantity,
        price: product.price,
        subtotal,
      };
    })
  );

  const orderData: any = {
    cashier_id: cashier_id,
    source,
    order_code: order_code,
    total,
    final_total: total,
    order_items: { create: validatedItems },
  };

  if (customer_id !== undefined) {
    orderData.customer_id = customer_id;
  }

  return prisma.$transaction( async(tx) => {
    const newOrder = await tx.order.create({
      data: orderData,
      include: { order_items: true },
    });

    for (const item of validatedItems) {
      await tx.product.update({
        where: { id: item.product_id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return newOrder;
  })
}