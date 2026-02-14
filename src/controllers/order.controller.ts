import { NextFunction, Request, Response } from "express";
import { OrderUtils } from "../utils/order.utils";
import { OrderService } from "../services/order.service";
import { ErrorHandler } from "../utils/error.utils";
import { PaginateUtils } from "../utils/pagination.utils";

export class OrderController {
  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new ErrorHandler(401, "Unauthorized");
      }

      const paginationQuery = PaginateUtils.parse(req.query);

      const { orders, meta } = await OrderService.getOrders(user, paginationQuery);

      res.status(200).json({
        success: true,
        message: "Fetched all orders successfully",
        data: orders,
        meta
      });
    } catch (error) {
      next(error);
    }
  };


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

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = parseInt(req.params.id as string);
      const { status } = req.body;

      if (!status) {
        throw new ErrorHandler(400, "Status is required");
      }

      const order = await OrderService.updateOrderStatus(orderId, status);

      res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  static async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = parseInt(req.params.id as string);

      const order = await OrderService.cancelOrder(orderId);

      res.status(200).json({
        success: true,
        message: "Order canceled successfully",
        data: order
      });
    } catch (error) {
      next(error);
    }
  };
}