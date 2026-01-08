import { DiscountRepository } from "../repositories/discount.repository";
import { ProductDiscountRepository } from "../repositories/product-discount.repository";
import { ProductRepository } from "../repositories/product.repository";
import { ProductDiscountCreateRequest } from "../types/product-discount";
import { ErrorHandler } from "../utils/error.utils";

export class ProductDiscountService{
  static async create(payload: ProductDiscountCreateRequest) {
    try {
      const existingProductAndDiscount = await ProductDiscountRepository.findProductAndDiscount(payload.productId, payload.discountId);
      if (existingProductAndDiscount) {
        throw new ErrorHandler(409, "Discount already assigned to product");
      };

      const product = await ProductRepository.findProductById(payload.productId);
      if (!product) {
        throw new ErrorHandler(404, "Product not found");
      };

      const discount = await DiscountRepository.findDiscountById(payload.discountId);
      if (!discount) {
        throw new ErrorHandler(404, "Discount not found");
      };

      const now = new Date();

      if (!discount.isActive) {
        throw new ErrorHandler(400, "Discount is not active");
      };

      if (
        (discount.startDate && discount.startDate > now) ||
        (discount.endDate && discount.endDate < now)
      ) {
        throw new ErrorHandler(400, "Discount is expired or not started yet");
      }

      const productDiscount = await ProductDiscountRepository.create(payload);
      return productDiscount;
    } catch (error) {
      throw error;
    };
  };
}