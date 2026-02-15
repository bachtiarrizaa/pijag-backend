import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.config";
import { ReviewCreateRequest, ReviewUpdateRequest } from "../types/review";

export class ReviewRepository {

  static async create(
    customerId: number,
    payload: ReviewCreateRequest
  ) {
    try {
      const review = await prisma.review.create({
        data: {
          customerId,
          productId: payload.productId,
          rating: payload.rating,
          comment: payload.comment ?? null,
        },
      });

      return review;
    } catch (error) {
      throw error;
    }
  }



  static async findByProduct(productId: number, skip: number, take: number) {
    try {
      return await prisma.review.findMany({
        where: { productId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async countByProduct(productId: number) {
    try {
      return await prisma.review.count({
        where: { productId },
      });
    } catch (error) {
      throw error;
    }
  }

  static async findByUserAndProduct(customerId: number, productId: number) {
    try {
      return await prisma.review.findFirst({
        where: {
          customerId,
          productId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async hasPurchased(customerId: number, productId: number) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          customerId,
          status: "completed",
          orderItems: {
            some: {
              productId: productId,
            },
          },
        },
      });

      return !!order;
    } catch (error) {
      throw error;
    }
  }

  static async findAll(skip: number, take: number, productId?: number) {
    try {
      const where: Prisma.ReviewWhereInput = {};
      if (productId) {
        where.productId = productId;
      }

      return await prisma.review.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            select: {
              name: true,
              image: true,
            }
          },
          customer: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async count(productId?: number) {
    try {
      const where: Prisma.ReviewWhereInput = {};
      if (productId) {
        where.productId = productId;
      }
      return await prisma.review.count({ where });
    } catch (error) {
      throw error;
    }
  }

  static async update(
    reviewId: number,
    payload: ReviewUpdateRequest
  ) {
    try {
      const review = await prisma.review.update({
        where: { id: reviewId },
        data: {
          rating: payload.rating,
          comment: payload.comment,
        }
      });
      return review;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      return await prisma.review.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}
