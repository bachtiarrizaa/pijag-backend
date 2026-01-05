import { NextFunction, Request, Response } from "express";
import { ProductCreateRequest, ProductUpdateRequest } from "../types/product";
import { ProductService } from "../services/product.service";
import { ErrorHandler } from "../utils/error.utils";

export class ProductController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as ProductCreateRequest;

      if (req.file) {
        payload.image = req.file.filename
      };

      const product = await ProductService.create(payload);
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
      });
    } catch (error) {
      next(error);
    };
  };

  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await ProductService.getProducts();
      res.status(200).json({
        success: true,
        message: "Fetched all products successfully",
        data: products
      });
    } catch (error) {
      next(error);
    };
  };

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = Number(req.params.id);
      const product = await ProductService.getProductById(productId);
      res.status(200).json({
        success: true,
        message: "Fetched product successfully",
        data: product
      });
    } catch (error) {
      next(error);
    };
  };

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = Number(req.params.id);
      if (!productId) {
        throw new ErrorHandler(400, "Product Id is Required");
      };
      const payload = req.body as ProductUpdateRequest;

      if (req.file) {
        payload.image = req.file.filename
      };

      const product = await ProductService.update(productId, payload);
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product
      });
    } catch (error) {
      next(error);
    };
  };

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = Number(req.params.id);
      if (!productId) {
        throw new ErrorHandler(400, "Product Id is Required");
      };

      const product = await ProductService.delete(productId);
      res.status(200).json({
        success: true,
        message: "Product deleted successfully"
      });
    } catch (error) {
      next(error);
    };
  };
}