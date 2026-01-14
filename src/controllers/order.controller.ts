import { NextFunction, Request, Response } from "express";
import { OrderUtils } from "../utils/order.utils";
import { OrderService } from "../services/order.service";

export class OrderController {
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