import { Request, Response } from "express";
import { sendSuccess, sendError } from "../../utils/respon.handler";
import { addItemToCartService, deleteCartItemServices, getCartServices, updateCartItemServices } from "../../services/cart/cartServices";
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
    const getCart = await getCartServices(customer.id);
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

export const updateCartItemControllers = async (req: Request, res: Response) => {
  try {
    const cartItemId = Number(req.params.id);

    const data: Cart = req.body;
    const updated = await updateCartItemServices(cartItemId, data);
    if ("message" in updated && updated.message === "Item removed from cart"){
      return sendSuccess(res, 200, "Item removed from cart", null);
    }
    return sendSuccess(res, 200, "Item update successfully", updated);
  } catch (error: any) {
    console.error("GetCart Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const deleteCartItemControlelr = async (req: Request, res: Response) => {
  try {
    const cartItemId = Number(req.params.id);
    const deleteItem = await deleteCartItemServices(cartItemId);
    return sendSuccess(res, 200, "Cart item delete successfully", deleteItem);
  } catch (error: any) {
    console.error("GetCart Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}