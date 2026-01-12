import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../config/prisma.config";

export class CartRepository{
  static async findCartByCustomerId(customerId: number) {
    try {
      const cart = await prisma.cart.findFirst({
        where: { customerId },
        include: {
          items: {
            include: { product: true }
          },
        },
      });
      return cart;
    } catch (error) {
      throw error;
    };
  };

  static async findCartById(cartId: number) {
    try {
      const cart = await prisma.cart.findFirst({
        where: { id: cartId }
      });
      return cart;
    } catch (error) {
      throw error;
    };
  };

  static async create(customerId: number) {
    try {
      const cart = await prisma.cart.create({
        data: { customerId },
        include: {
          items: { 
            include: { product: true }
           }
        }
      });
      return cart;
    } catch (error) {
      throw error;
    };
  };

  static async calculateCartTotal(cartId: number) {
    try {
      const aggregate = await prisma.cartItem.aggregate({
        where: { cartId },
        _sum: { subtotal: true }
      });

      return aggregate._sum.subtotal ?? new Decimal(0); 
    } catch (error) {
      throw error;
    };
  };

  static async updateTotal(cartId: number, total: Decimal) {
    try {
      const updateTotal = await prisma.cart.update({
        where: { id: cartId },
        data: { total }
      });

      return updateTotal;
    } catch (error) {
      throw error;
    };
  };
}