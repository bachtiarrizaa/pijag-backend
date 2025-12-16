import { createOrderService } from "../../services/order/order.service";
import { orderContext } from "../../utils/order.context"
import { Request, Response } from "express";
import { sendSuccess, sendError } from "../../utils/respon.handler";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const { cashier_id, data } = await orderContext(req);
    const order = await createOrderService(cashier_id, data);
    return sendSuccess(res, 201, "Order created successfully", order);
  } catch (error: any) {
    console.error("CreateOrder Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
};