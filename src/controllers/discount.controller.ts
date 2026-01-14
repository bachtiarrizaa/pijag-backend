import { Request, Response, NextFunction } from "express";
import { DiscountCreateRequest, DiscountType, DiscountUpdateRequest } from "../types/discount";
import { DiscountService } from "../services/discount.service";
import { ErrorHandler } from "../utils/error.utils";

export class DiscountController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as DiscountCreateRequest;
      const discount = await DiscountService.create(payload);
      res.status(201).json({
        success: true,
        message: "Discount created successfully",
        data: discount
      });
    } catch (error) {
      next(error);
    };
  };

  static async getDiscounts(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.query.type as DiscountType | undefined;
      const discounts = await DiscountService.getDiscounts(type);
      res.status(200).json({
        success: true,
        message: type ? `Discounts with type ${type} fetched` : "All discounts fetched",
        data: discounts
      });
    } catch (error) {
      next(error);
    };
  };

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const discountId = Number(req.params.id);
      if (!discountId) {
        throw new ErrorHandler(400, "Discount Id is required");
      };
      
      const payload = req.body as DiscountUpdateRequest;

      const updateDiscount = await DiscountService.update(discountId, payload);
      res.status(200).json({
        success: true,
        message: "Discount updated successfully",
        data: updateDiscount
      });
    } catch (error) {
      next(error);
    };
  };

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const discountId = Number(req.params.id);

      const deleteDiscount = await DiscountService.delete(discountId);
      res.status(200).json({
        success: true,
        message: "Discount deleted successfully"
      });
    } catch (error) {
      next(error);
    };
  };
}