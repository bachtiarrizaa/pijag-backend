import prisma from "../config/prisma.config";
import { ProductDiscountCreateRequest, ProductDiscountUpdateRequest } from "../types/product-discount";
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

  static async findProductDiscounts(skip: number, take: number) {
    try {
      const productDiscounts = await prisma.productDiscount.findMany({
        skip,
        take,
        orderBy: {
          createdAt: "desc"
        },
        // include: {
        //   product: true,
        //   discount: true
        // }
      });
      return productDiscounts;
    } catch (error) {
      throw error;
    };
  };

  static async count() {
    try {
      const countProductDiscounts = await prisma.productDiscount.count();
      return countProductDiscounts;
    } catch (error) {
      throw error;
    }
  }

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

  static async deactivateOtherDiscounts(productId: number, excludeId: number) {
    try {
      const productDiscount = await prisma.productDiscount.updateMany({
        where: {
          productId,
          id: { not: excludeId },
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
          isActive: payload.isActive,
        },
      });
      return productDiscount;
    } catch (error) {
      throw error;
    }
  }

  static async update(productDiscountId: number, payload: ProductDiscountUpdateRequest) {
    try {
      const productDiscount = await prisma.productDiscount.update({
        where: { id: productDiscountId },
        data: {
          discountId: payload.discountId,
          isActive: payload.isActive
        }
      });
      return productDiscount;
    } catch (error) {
      throw error
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