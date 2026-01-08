import { NextFunction, Request, Response } from "express";
import { ProductDiscountCreateRequest } from "../types/product-discount";
import { ProductDiscountService } from "../services/product-discount.service";

export class ProductDiscountController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as ProductDiscountCreateRequest;

      const productDiscount = await ProductDiscountService.create(payload);

      res.status(201).json({
        success: true,
        message: "Discount assigned to product",
        data: productDiscount
      });
    } catch (error) {
      next(error);
    };
  };
}