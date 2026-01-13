import { Decimal } from "@prisma/client/runtime/library";
import { CartItemRepository } from "../repositories/cart-item.repository";
import { CartRepository } from "../repositories/cart.repository";
import { CustomerRepository } from "../repositories/customer.repository";
import { ProductRepository } from "../repositories/product.repository";
import { Cart, CartCreateRequest, CartUpdateRequest } from "../types/cart";
import { DiscountUtils } from "../utils/discount.utils";
import { ErrorHandler } from "../utils/error.utils";

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
      const customer = await CustomerRepository.findByCustomerId(customerId);
      if (!customer) {
        throw new ErrorHandler(404, "Customer not found");
      }

      if (payload.quantity <= 0) {
        throw new ErrorHandler(400, "Quantity must be greater than 0");
      }

      const product = await ProductRepository.findProductById(payload.productId);
      if (!product) {
        throw new ErrorHandler(404, "Product not found");
      }

      const pricedProduct = DiscountUtils.calculateDiscount(product);
      const finalPrice = pricedProduct.finalPrice;

      let cart = await CartRepository.findCartByCustomerId(customerId);
      if (!cart) {
        cart = await CartRepository.create(customerId);
      }

      const existingItem = await CartItemRepository.findCartItemProduct(
        cart.id,
        payload.productId
      );

      const totalQuantity = existingItem
        ? existingItem.quantity + payload.quantity
        : payload.quantity;

      if (totalQuantity > product.stock) {
        throw new ErrorHandler(400, "Quantity exceeds available stock");
      }

      let cartItem;

      if (existingItem) {
        cartItem = await CartItemRepository.updateQuantity(
          existingItem.id,
          {
            quantity: totalQuantity,
            price: finalPrice,
            subtotal: finalPrice.mul(totalQuantity)
          }
        );
      } else {
        cartItem = await CartItemRepository.create({
          cartId: cart.id,
          productId: payload.productId,
          quantity: payload.quantity,
          price: finalPrice,
          subtotal: finalPrice.mul(payload.quantity)
        });
      }

      const total = await CartRepository.calculateCartTotal(cart.id);
      await CartRepository.updateTotal(cart.id, total);

      return cartItem;
    } catch (error) {
      throw error;
    }
  }

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

      const pricedProduct = DiscountUtils.calculateDiscount(product);
      const finalPrice = pricedProduct.finalPrice;
      const subtotal = finalPrice.mul(quantity);

      const updateItem = await CartItemRepository.updateQuantity(
        cartItemId,
        {
          quantity,
          subtotal,
          price: finalPrice
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

      const cartId = findCartItem.cartId;

      const deleteItem = await CartItemRepository.delete(cartItemId);

      const total = await CartRepository.calculateCartTotal(cartId);

      await CartRepository.updateTotal(cartId, total);

      return deleteItem;
    } catch (error) {
      throw error;
    };
  };
}