import { Decimal } from "@prisma/client/runtime/library";
import { CartItemRepository } from "../repositories/cart-item.repository";
import { CartRepository } from "../repositories/cart.repository";
import { CustomerRepository } from "../repositories/customer.repository";
import { ProductRepository } from "../repositories/product.repository";
import { Cart, CartCreateRequest, CartQuantity, CartUpdateRequest } from "../types/cart";
import { DiscountUtils } from "../utils/discount.utils";
import { ErrorHandler } from "../utils/error.utils";
import { CartItem } from "../types/cart-item";

export class CartService{
  static async getCart(customerId: number) {
    try {
      let cart = await CartRepository.findCartByCustomerId(customerId);
      if (!cart) {
        return await CartRepository.create(customerId);
      };

      const productIds = cart.items.map(item => item.productId);
      const products = await ProductRepository.findProductByIds(productIds);
      
      const productMap = new Map(products.map(p => [p.id, p]));

      let total = new Decimal(0);

      const updatedItems = cart.items.map(item => {
        const product = productMap.get(item.productId);

        if (!product) {
          throw new ErrorHandler(404, `Product with id ${item.productId} not found`);
        };

        const pricedProduct = DiscountUtils.calculateDiscount(product);
        const finalPrice = pricedProduct.finalPrice;
        const subtotal = finalPrice.mul(item.quantity);

        total = total.add(subtotal);

        return {
          ...item,
          price: finalPrice,
          subtotal,
          product: {
            ...product,
            discounts: pricedProduct.discount
          }
        };
      });

      await CartRepository.updateTotal(cart.id, total);

      return {
        ...cart,
        items: updatedItems,
        total
      };
    } catch (error) {
      throw error;
    };
  };

  static async addItem(customerId: number, payload: CartCreateRequest) {
    try {
      const itemData = {
        productId: payload.productId,
        quantity: payload.quantity
      }

      const customer = await CustomerRepository.findByCustomerId(customerId);
      if (!customer) {
        throw new ErrorHandler(404, "Customer not found");
      }

      if (itemData.quantity <= 0) {
        throw new ErrorHandler(400, "Quantity must be greater than 0");
      }

      const product = await ProductRepository.findProductById(itemData.productId);
      if (!product) {
        throw new ErrorHandler(404, "Product not found");
      }
      
      let cart = await CartRepository.findCartByCustomerId(customerId);
      if (!cart) {
        cart = await CartRepository.create(customerId);
      }
      
      const existingItem = await CartItemRepository.findCartItemProduct(
        cart.id,
        itemData.productId
      );
      
      const totalQuantity = existingItem
      ? existingItem.quantity + itemData.quantity
      : itemData.quantity;
      
      if (totalQuantity > product.stock) {
        throw new ErrorHandler(400, "Quantity exceeds available stock");
      }

      const pricedProduct = DiscountUtils.calculateDiscount(product);
      const finalPrice = pricedProduct.finalPrice;

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
        const cartItemData: CartItem = {
          cartId: cart.id,
          productId: itemData.productId,
          quantity: itemData.quantity,
          price: finalPrice,
          subtotal: finalPrice.mul(itemData.quantity)
        }

        cartItem = await CartItemRepository.create(cartItemData);
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
      const itemData = {
        quantity: payload.quantity
      }

      if (itemData.quantity < 0) {
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

      if (itemData.quantity > product.stock) {
        throw new ErrorHandler(400, "Quantity exceeds available stock");
      };

      const cart = await CartRepository.findCartById(cartItem.cartId);
      if (!cart) {
        throw new ErrorHandler(404, "Cart not found")
      };

      if (itemData.quantity === 0) {
        await CartItemRepository.delete(cartItemId);

        const total = await CartRepository.calculateCartTotal(cart.id);
        await CartRepository.updateTotal(cart.id, total);

        return null;
      }

      const pricedProduct = DiscountUtils.calculateDiscount(product);
      const finalPrice = pricedProduct.finalPrice;
      const subtotal = finalPrice.mul(itemData.quantity);

      const updatedQuantityData = {
        quantity: itemData.quantity,
        subtotal,
        price: finalPrice
      }
    
      const updatedItem = await CartItemRepository.updateQuantity(
        cartItemId,
        updatedQuantityData
      );

      const total = await CartRepository.calculateCartTotal(cart.id);
      await CartRepository.updateTotal(cart.id, total);

      return updatedItem;
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