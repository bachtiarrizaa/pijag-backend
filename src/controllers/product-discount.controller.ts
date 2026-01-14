import { NextFunction, Request, Response } from "express";
import { ProductDiscountCreateRequest, ProductDiscountUpdateRequest } from "../types/product-discount";
import { ProductDiscountService } from "../services/product-discount.service";
import { ErrorHandler } from "../utils/error.utils";

export class ProductDiscountController {
  static async getProductDiscounts(req: Request, res: Response, next: NextFunction) {
    try {
      const productDiscounts = await ProductDiscountService.getProductDiscount();
      res.status(200).json({
        success: true,
        message: "Product discounts fetched successfully",
        data: productDiscounts
      });
    } catch (error) {
      next(error);
    };
  };

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

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const productDiscountId = Number(req.params.id);
      if (!productDiscountId) {
        throw new ErrorHandler(400, "Discount Id is required");
      }

      const payload = req.body as ProductDiscountUpdateRequest;

      const productDiscount = await ProductDiscountService.update(productDiscountId, payload);
      
      res.status(200).json({
        success: true,
        message: "Product discount updated successfully",
        data: productDiscount
      });
    } catch (error) {
      next(error);
    };
  };

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const productDiscountId = Number(req.params.id);
      if (!productDiscountId) {
        throw new ErrorHandler(400, "Product Discount Id is required");
      };

      const productDiscount = await ProductDiscountService.updateStatus(productDiscountId);

      res.status(200).json({
        success: true,
        message: "Product discount status update successfully",
        data: productDiscount
      });
    } catch (error) {
      next(error);
    };
  };

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const productDiscountId = Number(req.params.id);
      if (!productDiscountId) {
        throw new ErrorHandler(400, "Product Discount Id is required");
      };

      const productDiscount = await ProductDiscountService.delete(productDiscountId);
      res.status(200).json({
        success: true,
        message: "Product discount delete successfully"
      })
    } catch (error) {
      next(error);
    };
  };
};