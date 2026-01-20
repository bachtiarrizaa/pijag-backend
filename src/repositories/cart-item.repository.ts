import prisma from "../config/prisma.config";
import { CartItemCreateRequest, CartItemUpdateQuantity, CartItemUpdateRequest } from "../types/cart-item";

export class CartItemRepository {
  static async findCartItemProduct(cartId: number, productId: number) {
    try {
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          cartId,
          productId
        },
      });
      return cartItem;
    } catch (error) {
      throw error;
    };
  };

  static async findCartItemById(cartItemId: number) {
    try {
      const cartItem = await prisma.cartItem.findFirst({
        where: { id: cartItemId }
      });
      return cartItem;
    } catch (error) {
      throw error;
    };
  };

  static async findByCardId(cartId: number) {
    try {
      const cartItems = await prisma.cartItem.findMany({
        where: { id: cartId }
      });
      return cartItems;
    } catch (error) {
      throw error;
    };
  };
  
  static async create(payload: CartItemCreateRequest) {
    try {
      const items = await prisma.cartItem.create({
        data: {
          cartId: payload.cartId,
          productId: payload.productId,
          quantity: payload.quantity,
          price: payload.price,
          subtotal: payload.subtotal
        }
      });
      return items;
    } catch (error) {
      throw error;
    };
  };

  static async updateQuantity(cartItemId: number, payload: CartItemUpdateQuantity) {
    try {
      const cartItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: {
          quantity: payload.quantity,
          price: payload.price,
          subtotal: payload.subtotal
        }
      });
      return cartItem;
    } catch (error) {
      throw error;
    };
  };

  static async updateById(cartItemId: number, payload: CartItemUpdateRequest) {
    try {
      const cartItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: {
          price: payload.price,
          subtotal: payload.subtotal
        }
      });

      return cartItem;
    } catch (error) {
      throw error;
    };
  };

  static async delete(cartItemId: number) {
    try {
      const cart = await prisma.cartItem.delete({
        where: { id: cartItemId }
      });
      return cart;
    } catch (error) {
      throw error;
    }
  }
}