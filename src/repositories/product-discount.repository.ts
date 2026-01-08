import prisma from "../config/prisma.config";
import { ProductDiscountCreateRequest, ProductDiscountUpdateRequest } from "../types/product-discount";

export class ProductDiscountRepository {
  static async findProductAndDiscount(productId: number, discountId: number) {
    try {
      const productDiscount = await prisma.productDiscount.findFirst({
        where: {
          productId,
          discountId
        }
      });
      return productDiscount;
    } catch (error) {
      throw error;
    };
  };

  static async findProductDiscounts() {
    try {
      const productDiscount = await prisma.productDiscount.findMany({
        orderBy: {
          createdAt: "desc"
        }
      });
      return productDiscount;
    } catch (error) {
      throw error;
    };
  };

  static async findProductDiscountById(productDiscountId: number) {
    try {
      const productDiscount = await prisma.productDiscount.findFirst({
        where: { id: productDiscountId }
      });
      return productDiscount;
    } catch (error) {
      throw error;
    };
  };

  static async create(payload: ProductDiscountCreateRequest) {
    try {
      const productDiscount = await prisma.productDiscount.create({
        data: {
          productId: payload.productId,
          discountId: payload.discountId,
        },
      });
      return productDiscount;
    } catch (error) {
      throw error;
    };
  };

  static async update(productDiscountId: number, payload: ProductDiscountUpdateRequest) {
    try {
      const productDiscount = await prisma.productDiscount.update({
        where: { id: productDiscountId },
        data: {
          productId: payload.productId,
          discountId: payload.discountId
        }
      });
      return productDiscount;
    } catch (error) {
      throw error;
    };
  };

  static async delete(productDiscountId: number) {
    try {
      const productDiscount = await prisma.productDiscount.delete({
        where: { id: productDiscountId }
      });
      return productDiscount;
    } catch (error) {
      throw error;
    };
  };
}