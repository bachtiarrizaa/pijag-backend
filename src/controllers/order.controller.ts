import { NextFunction, Request, Response } from "express";
import { OrderUtils } from "../utils/order.utils";
import { OrderService } from "../services/order.service";
import { ErrorHandler } from "../utils/error.utils";

export class OrderController {
  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new ErrorHandler(401, "Unauthorized");
      }

      const orders = await OrderService.getOrders(user);

      res.status(200).json({
        success: true,
        message: "Fetched all orders successfully",
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { cashierId, payload } = await OrderUtils.orderContext(req);
			const order = await OrderService.create(cashierId, payload);
			res.status(201).json({
				success: true,
				message: "Order created successfully",
				data: order
			});
		} catch (error) {
			next(error);
		};
	};
}