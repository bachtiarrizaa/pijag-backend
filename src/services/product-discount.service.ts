import { DiscountRepository } from "../repositories/discount.repository";
import { ProductDiscountRepository } from "../repositories/product-discount.repository";
import { ProductRepository } from "../repositories/product.repository";
import { ProductDiscountCreateRequest, ProductDiscountUpdateRequest } from "../types/product-discount";
import { ErrorHandler } from "../utils/error.utils";

export class ProductDiscountService {
  static async getProductDiscount() {
    try {
      const productDiscounts = await ProductDiscountRepository.findProductDiscounts();
      return productDiscounts;
    } catch (error) {
      throw error;
    }
  }

  static async create(payload: ProductDiscountCreateRequest) {
    try {
      const findProductDiscount = await ProductDiscountRepository.findProductAndDiscount(payload.productId, payload.discountId);
      if (findProductDiscount) {
        throw new ErrorHandler(409, "Discount already assigned to product");
      }

      const product = await ProductRepository.findProductById(payload.productId);
      if (!product) {
        throw new ErrorHandler(404, "Product not found");
      }

      const discount = await DiscountRepository.findDiscountById(payload.discountId);
      if (!discount) {
        throw new ErrorHandler(404, "Discount not found");
      }

      const now = new Date();
      if (!discount.isActive) {
        throw new ErrorHandler(400, "Discount is not active");
      }
      if ((discount.startDate && discount.startDate > now) || (discount.endDate && discount.endDate < now)) {
        throw new ErrorHandler(400, "Discount is expired or not started yet");
      }

      return await ProductDiscountRepository.create(payload);
    } catch (error) {
      throw error;
    }
  }

  static async update(productDiscountId: number, payload: ProductDiscountUpdateRequest) {
    try {
      const findProductDiscount = await ProductDiscountRepository.findProductDiscountById(productDiscountId);
      if (!findProductDiscount) {
        throw new ErrorHandler(404, "Product discount not found");
      }

      const discount = await DiscountRepository.findDiscountIsActive(payload.discountId);
      if (!discount) {
        throw new ErrorHandler(400, "Discount not active or expired");
      }

      const existing = await ProductDiscountRepository.findProductAndDiscount(findProductDiscount.productId, payload.discountId);

      let updatedRow;
      if (existing) {
        updatedRow = await ProductDiscountRepository.updateStatus(existing.id, true);
      } else {
        updatedRow = await ProductDiscountRepository.create({
          productId: findProductDiscount.productId,
          discountId: payload.discountId
        });
      }

      await ProductDiscountRepository.deactivateOtherDiscounts(findProductDiscount.productId, payload.discountId);

      return updatedRow;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(productDiscountId: number) {
    try {
      const findProductDiscount = await ProductDiscountRepository.findProductDiscountById(productDiscountId);
      if (!findProductDiscount) {
        throw new ErrorHandler(404, "Product discount not found");
      }
      
      const productDiscount = await ProductDiscountRepository.updateStatus(productDiscountId, !findProductDiscount.isActive);
      return productDiscount;
    } catch (error) {
      throw error;
    };
  };

  static async delete(productDiscountId: number) {
    try {
      const findProductDiscount = await ProductDiscountRepository.findProductDiscountById(productDiscountId);
      if (!findProductDiscount) {
        throw new ErrorHandler(404, "Product discount not found");
      };

      const productDiscount = await ProductDiscountRepository.delete(productDiscountId);
      return productDiscount;
    } catch (error) {
      throw error;
    };
  };
}
