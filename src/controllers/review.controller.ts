import { NextFunction, Request, Response } from "express";
import { ReviewService } from "../services/review.service";
import { ErrorHandler } from "../utils/error.utils";
import { PaginateUtils } from "../utils/pagination.utils";
import { ReviewCreateRequest, ReviewUpdateRequest } from "../types/review";

export class ReviewController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: ReviewCreateRequest = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new ErrorHandler(401, "Unauthorized");
      }

      const review = await ReviewService.create(userId, payload);

      res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductReviews(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { productId } = req.params;
      const query = PaginateUtils.parse(req.query);

      const { reviews, meta } = await ReviewService.getProductReviews(query, Number(productId));

      res.status(200).json({
        success: true,
        message: "Reviews fetched successfully",
        data: reviews,
        meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const query = PaginateUtils.parse(req.query);
      const productId = req.query.productId
        ? parseInt(req.query.productId as string)
        : undefined;

      const { reviews, meta } = await ReviewService.getAllReviews(query, productId);

      res.status(200).json({
        success: true,
        message: "Reviews fetched successfully",
        data: reviews,
        meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewId = Number(req.params.id)
      if (!reviewId) {
        throw new ErrorHandler(400, "Review Id is required")
      }
      const payload: ReviewUpdateRequest = req.body;

      const review = await ReviewService.updateReview(
        reviewId,
        payload
      );

      res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewId = Number(req.params.id);
      
      if (!reviewId) {
        throw new ErrorHandler(400, "Review id is required");
      }

      await ReviewService.deleteReview(reviewId);

      res.status(200).json({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
