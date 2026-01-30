import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/error.utils";
import { PaymentCreateRequest } from "../types/payment";
import { PaymentService } from "../services/payment.service";

export class PaymentController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new ErrorHandler(401, "Unauthorized");
      };

      const payload = req.body as PaymentCreateRequest;
      const payment = await PaymentService.create(user, payload);
      res.status(201).json({
        success: true,
        message: "Payment successfully",
        data: payment
      });
    } catch (error) {
      throw error;
    };
  };
}