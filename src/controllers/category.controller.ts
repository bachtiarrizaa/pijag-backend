import { NextFunction, Request, Response } from "express";
import { CategoryCreateRequest, CategoryUpdateRequest } from "../types/category";
import { CategoryService } from "../services/category.service";
import { ErrorHandler } from "../utils/error.utils";

export class CategoryController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CategoryCreateRequest;
      const category = await CategoryService.create(payload);
      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category
      });
    } catch (error) {
      next(error);
    };
  };

  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getCategories();
      res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        data: categories
      });
    } catch (error) {
      next(error);
    };
  };

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = Number(req.params.id);
      if (!categoryId) {
        throw new ErrorHandler(400, "Categori Id is Required");
      };
      const payload = req.body as CategoryUpdateRequest;

      const category = await CategoryService.update(categoryId, payload);
      res.status(200).json({
        success: true,
        message: "Category update successfully",
        data: category
      });
    } catch (error) {
      next(error);
    };
  };

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = Number(req.params.id);
      if (!categoryId) {
        throw new ErrorHandler(400, "Category Id is Required");
      };

      const category = await CategoryService.delete(categoryId);
      res.status(200).json({
        success: true,
        message: "Category deleted successfully"
      });
    } catch (error) {
      next(error);
    };
  };
}