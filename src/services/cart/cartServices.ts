import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../../config/prisma.config"
import { Cart } from "../../types/cart/cart";

export const getCartServices = async(customerId: number) => {
  const getCart = await prisma.cart.findFirst({
    where: { customer_id: customerId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!getCart) {
    return {
      id: null,
      customer_id: customerId,
      total: 0,
      items: []
    };
  }

  return getCart;
}

export const addItemToCartService = async (customerId: number, data: Cart) => {
  const { productId, quantity } = data;

  if (quantity <= 0) {
    const error: any = new Error("Quantity must be greater than 0");
    error.statusCode = 400;
    throw error;
  }

  const customer = await prisma.customer.findFirst({
    where: { id: customerId }
  });

  if (!customer) {
    const error: any = new Error("Customer record not found.")
    error.statusCode = 400;
    throw error;
  }

  let cart = await prisma.cart.findFirst({
    where: { customer_id: customerId }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        customer_id: customerId
      }
    });
  }

  let cartItem = await prisma.cartItem.findFirst({
    where: { cart_id: cart.id, product_id: productId }
  });

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    const error: any = new Error("Product not found")
    error.statusCode = 400;
    throw error;
  }

  const price = product.price.toNumber();

  if (quantity > product.stock) {
    const error: any = new Error("Quantity exceeds available stock");
    error.statusCode = 400;
    throw error;
  }
  const subtotal = new Decimal(price * quantity);

  if (cartItem) {
    cartItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: {
        quantity: cartItem.quantity + quantity,
        subtotal: new Decimal(price * (cartItem.quantity + quantity))
      }
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        product_id: productId,
        quantity,
        price,
        subtotal,
      }
    });
  }

  const total = await prisma.cartItem.aggregate({
    where: { cart_id: cart.id },
    _sum: { subtotal: true }
  });

  await prisma.cart.update({
    where: { id: cart.id },
    data: {
      total: total._sum.subtotal || new Decimal(0)
    }
  });

  return cartItem;
};

export const updateCartItemServices = async (cartItemId: number, data: Cart) => {
  const { quantity } = data;

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId }
  });

  if (!cartItem) {
    const error: any = new Error ("Cart item not found");
    error.statusCode = 404;
    throw error;
  }

  const product = await prisma.product.findUnique({
    where: { id: cartItem.product_id }
  });

  if (!product) {
    const error: any = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (quantity > product.stock) {
    const error: any = new Error("Quantity exceeds available stock");
    error.statusCode = 400;
    throw error;
  }

  if (quantity === 0) {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    const total = await prisma.cartItem.aggregate({
      where: { cart_id: cartItem.cart_id },
      _sum: { subtotal: true }
    });

    await prisma.cart.update({
      where: { id: cartItem.cart_id },
      data: {
        total: total._sum.subtotal || new Decimal(0)
      }
    });

    return { message: "Item removed from cart" };
  }

  const subtotal = new Decimal(cartItem.price).mul(quantity);

  const updateItem = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: {
      quantity,
      subtotal
    }
  });

  const total = await prisma.cartItem.aggregate({
    where: { cart_id: cartItem.cart_id },
    _sum: { subtotal: true }
  });

  await prisma.cart.update({
    where: { id: cartItem.cart_id },
    data: { total: total._sum.subtotal || new Decimal(0) }
  });

  return updateItem;
}

export const deleteCartItemServices = async (cartItemId: number) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId }
  });

  if (!cartItem) {
    const error: any = new Error ("Cart item not found");
    error.statusCode = 404;
    throw error;
  }

  const deleteItem = await prisma.cartItem.delete({
    where: { id: cartItemId }
  });

  const total = await prisma.cartItem.aggregate({
    where: { cart_id: cartItem.cart_id },
    _sum: { subtotal: true }
  });

  await prisma.cart.update({
    where: { id: cartItem.cart_id },
    data: { total: total._sum.subtotal || new Decimal(0)}
  });

  return deleteItem;
}