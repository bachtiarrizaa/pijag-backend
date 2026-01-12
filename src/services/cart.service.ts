import { Decimal } from "@prisma/client/runtime/library";
import { CartItemRepository } from "../repositories/cart-item.repository";
import { CartRepository } from "../repositories/cart.repository";
import { CustomerRepository } from "../repositories/customer.repository";
import { ProductRepository } from "../repositories/product.repository";
import { Cart, CartCreateRequest, CartUpdateRequest } from "../types/cart";
import { CartItemCreateRequest } from "../types/cart-item";
import { ErrorHandler } from "../utils/error.utils";
import prisma from "../config/prisma.config";

export class CartService{
  static async getCart(customerId: number) {
    try {
      const cart = await CartRepository.findCartByCustomerId(customerId);

      if (!cart) {
        return await CartRepository.create(customerId);
      }

      return cart;
    } catch (error) {
      throw error;
    };
  };

  static async addItem(customerId: number, payload: CartCreateRequest) {
    try {
      // const { productId, quantity } = payload;
      const cartData: Cart = {
        productId: payload.productId,
        quantity: payload.quantity
      };

      const customer = await CustomerRepository.findByCustomerId(customerId);
      if (!customer) {
        throw new ErrorHandler(404, "Customer not found");
      };

      if (cartData.quantity <= 0) {
        throw new ErrorHandler(400, "Quantity must be greater than 0");
      };

      const product = await ProductRepository.findProductById(cartData.productId);
      if (!product) {
        throw new ErrorHandler(404, "Product not found");
      };

      let cart = await CartRepository.findCartByCustomerId(customerId);
      if (!cart) {
        cart = await CartRepository.create(customerId);
      };

      const existingItem = await CartItemRepository.findCartItemProduct(
        cart.id,
        cartData.productId
      );

      if (existingItem && existingItem.quantity + cartData.quantity > product.stock) {
        throw new ErrorHandler(400, "Quantity exceeds available stock");
      }

      const price = product.price;
      let cartItem;
      const subtotal = price.mul(cartData.quantity);

      if (existingItem) {
        const newQuantity = existingItem.quantity + cartData.quantity;

        cartItem = await CartItemRepository.updateQuantity(
          existingItem.id, {
            quantity: newQuantity,
            subtotal: price.mul(newQuantity)
          }
        );
      } else {
        cartItem = await CartItemRepository.create({
          cartId: cart.id,
          productId: cartData.productId,
          quantity: cartData.quantity,
          price: product.price,
          subtotal
        });
      };

      const total = await CartRepository.calculateCartTotal(cart.id);

      await CartRepository.updateTotal(cart.id, total);

      // return await CartRepository.findCartByCustomerId(customerId);
      return cartItem;
    } catch (error) {
      throw error;
    };
  };

  static async updateItem(cartItemId: number, payload: CartUpdateRequest) {
    try {
      const { quantity } = payload;

      if (quantity < 0) {
        throw new ErrorHandler(400, "Quantity cannot be negative");
      };

      const cartItem = await CartItemRepository.findCartItemById(cartItemId);
      if (!cartItem) {
        throw new ErrorHandler(404, "Cart item not found");
      };

      const product = await ProductRepository.findProductById(cartItem.productId);
      if (!product) {
        throw new ErrorHandler(404, "Product not found");
      };

      if (quantity > product.stock) {
        throw new ErrorHandler(400, "Quantity exceeds available stock");
      };

      const cart = await CartRepository.findCartById(cartItem.cartId);
      if (!cart) {
        throw new ErrorHandler(404, "Cart not found")
      };

      if (quantity === 0) {
        await CartItemRepository.delete(cartItemId);

        const total = await CartRepository.calculateCartTotal(cart.id);
        await CartRepository.updateTotal(cart.id, total);

        return {
          message: "Item removed from cart"
        };
      }

      const subtotal = product.price.mul(quantity);

      const updateItem = await CartItemRepository.updateQuantity(
        cartItemId,
        {
          quantity,
          subtotal
        }
      );

      const total = await CartRepository.calculateCartTotal(cart.id);
      await CartRepository.updateTotal(cart.id, total);

      return updateItem;
    } catch (error) {
      throw error;
    };
  };

  static async delete(cartItemId: number) {
    try {
      const findCartItem = await CartItemRepository.findCartItemById(cartItemId);
      if (!findCartItem) {
        throw new ErrorHandler(404, "Cart item not found");
      };

      const deleteItem = await CartItemRepository.delete(cartItemId);

      const total = await CartRepository.calculateCartTotal(cartItemId);

      await CartRepository.updateTotal(cartItemId, total);

      return deleteItem;
    } catch (error) {
      throw error;
    };
  };
}