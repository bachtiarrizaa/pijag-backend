import { ReviewRepository } from "../repositories/review.repository";
import { ErrorHandler } from "../utils/error.utils";
import prisma from "../config/prisma.config";
import { PaginateUtils } from "../utils/pagination.utils";

import { ReviewCreateRequest, ReviewUpdateRequest } from "../types/review";
import { PaginationQuery } from "../types/pagination";

export class ReviewService {

  static async create(userId: number, data: ReviewCreateRequest) {
    const customer = await prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new ErrorHandler(403, "Only customers can leave reviews");
    }

    if (!data.productId || !data.rating) {
      throw new ErrorHandler(400, "Product ID and Rating are required");
    }

    if (data.rating < 1 || data.rating > 5) {
      throw new ErrorHandler(400, "Rating must be between 1 and 5");
    }

    const hasPurchased = await ReviewRepository.hasPurchased(
      customer.id,
      data.productId
    );

    if (!hasPurchased) {
      throw new ErrorHandler(
        403,
        "You can only review products you have purchased and received (completed order)"
      );
    }

    const existingReview = await ReviewRepository.findByUserAndProduct(
      customer.id,
      data.productId
    );

    if (existingReview) {
      throw new ErrorHandler(400, "You have already reviewed this product");
    }

    const payload: ReviewCreateRequest = {
      productId: data.productId,
      rating: data.rating,
    };

    if (data.comment !== undefined) {
      payload.comment = data.comment;
    }

    return await ReviewRepository.create(customer.id, payload);
  }

  static async getProductReviews(query: PaginationQuery, productId: number) {
    const { page, limit, offset } = PaginateUtils.paginate(query);
    const reviews = await ReviewRepository.findByProduct(productId, offset, limit);
    const total = await ReviewRepository.countByProduct(productId);

    const meta = PaginateUtils.buildMeta({
      totalItems: total,
      currentPage: page,
      itemsPerPage: limit,
      itemCount: reviews.length,
    })

    return { reviews, meta }
  }

  static async getAllReviews(query: PaginationQuery, productId?: number) {
    const { page, limit, offset } = PaginateUtils.paginate(query);
    const reviews = await ReviewRepository.findAll(offset, limit, productId);
    const total = await ReviewRepository.count(productId);

    const meta = PaginateUtils.buildMeta({
      totalItems: total,
      currentPage: page,
      itemsPerPage: limit,
      itemCount: reviews.length,
    })

    return { reviews, meta }
  }

  static async updateReview(reviewId: number, payload: ReviewUpdateRequest) {
    return await ReviewRepository.update(reviewId, payload);
  }

  static async deleteReview(reviewId: number) {
    return await ReviewRepository.delete(reviewId);
  }
}
