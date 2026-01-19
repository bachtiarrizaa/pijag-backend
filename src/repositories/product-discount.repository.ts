import prisma from "../config/prisma.config";
import { ProductDiscountCreateRequest } from "../types/product-discount";
import { ErrorHandler } from "../utils/error.utils";

export class ProductDiscountRepository {
  static async findProductAndDiscount(productId: number, discountId: number) {
    try {
      const productDiscount = await prisma.productDiscount.findFirst({
        where: {
          productId,
          discountId,
        }
      });
      return productDiscount;
    } catch (error) {
      throw error;
    };
  };

  static async findProductDiscounts() {
    try {
      const productDiscounts = await prisma.productDiscount.findMany({
        orderBy: { id: "desc" },
        include: {
          product: true,
          discount: true
        }
      });
      return productDiscounts;
    } catch (error) {
      throw error;
    };
  };

  static async findProductDiscountById(productDiscountId: number) {
    try {
      const productDiscount = await prisma.productDiscount.findFirst({
        where: { id: productDiscountId },
      });
      return productDiscount;
    } catch (error) {
      throw error;
    };
  };

  static async updateStatus(productDiscountId: number, isActive: boolean) {
    try {
      const findProductDiscount = await prisma.productDiscount.findFirst({
        where: { id: productDiscountId },
        include: { discount: true }
      });

      if (!findProductDiscount) {
        throw new ErrorHandler(404, "ProductDiscount not found");
      };
      
      if (!findProductDiscount.discount.isActive) {
        throw new ErrorHandler(400, "Cannot update ProductDiscount: Discount is not active");
      };

      const productDiscount = await prisma.productDiscount.update({
        where: { id: productDiscountId },
        data: { isActive }
      });

      return productDiscount;
    } catch (error) {
      throw error;
    };
  };

  static async deactivateOtherDiscounts(productId: number, discountIdToActivate: number) {
    try {
      const productDiscount = await prisma.productDiscount.updateMany({
        where: {
          productId,
          discountId: { not: discountIdToActivate },
          isActive: true
        },
        data: { isActive: false }
      });
      return productDiscount;
    } catch (error) {
      throw error;
    }
  }

  static async create(payload: ProductDiscountCreateRequest) {
    try {
      const productDiscount = await prisma.productDiscount.create({
        data: {
          productId: payload.productId,
          discountId: payload.discountId,
          isActive: true,
        },
      });
      return productDiscount;
    } catch (error) {
      throw error;
    }
  }

  static async delete(productDiscountId: number) {
    try {
      const productDiscount = await prisma.productDiscount.delete({
        where: { id: productDiscountId },
      });
      return productDiscount;  
    } catch (error) {
      throw error;
    };
  };
}