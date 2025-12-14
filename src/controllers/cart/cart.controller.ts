import { Request, Response } from "express";
import { sendSuccess, sendError } from "../../utils/respon.handler";
import {
  addItemToCartService,
  deleteCartItemService,
  getCartService,
  updateCartItemService
} from "../../services/cart/cart.service";
import { Cart } from "../../types/cart/cart";
import prisma from "../../config/prisma.config";

export const getCartControllers = async(req: Request, res: Response) => {
  try {
    // const customerId = req.user?.customerId;
    const userId = req.user?.id;
    const customer = await prisma.customer.findUnique({
      where: { user_id: userId }
    });
    if (!customer) {
      return sendError(res, 400, "Customer not found");
    }
    console.log("Customer id", customer.id)
    const getCart = await getCartService(customer.id);
    return sendSuccess(
      res, 200, "Cart fetched successfully",
      getCart,
    );
  } catch (error: any) {
    console.error("GetCart Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const addItemToCartController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const customer = await prisma.customer.findUnique({
      where: { user_id: userId }
    });

    if (!customer) {
      return sendError(res, 400, "Customer not found");
    }

    const data: Cart = req.body;
    console.log("DEBUG CUSTOMER ID:", customer.id);


    const cartItem = await addItemToCartService(customer.id, data);
    return sendSuccess(res, 201, "Item added to cart successfully", cartItem);
  } catch (error: any) {
    console.error("GetCart Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
};

export const updateCartItemController = async (req: Request, res: Response) => {
  try {
    const cartItemId = Number(req.params.id);

    const data: Cart = req.body;
    const updated = await updateCartItemService(cartItemId, data);
    if ("message" in updated && updated.message === "Item removed from cart"){
      return sendSuccess(res, 200, "Item removed from cart", null);
    }
    return sendSuccess(res, 200, "Item update successfully", updated);
  } catch (error: any) {
    console.error("GetCart Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const deleteCartItemController = async (req: Request, res: Response) => {
  try {
    const cartItemId = Number(req.params.id);
    const deleteItem = await deleteCartItemService(cartItemId);
    return sendSuccess(res, 200, "Cart item delete successfully", deleteItem);
  } catch (error: any) {
    console.error("GetCart Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}