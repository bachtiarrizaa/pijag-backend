import { DiscountRepository } from "../repositories/discount.repository";
import { ProductDiscountRepository } from "../repositories/product-discount.repository";
import { ProductRepository } from "../repositories/product.repository";
import { PaginationQuery } from "../types/pagination";
import { ProductDiscount, ProductDiscountCreateRequest, ProductDiscountUpdateRequest } from "../types/product-discount";
import { ErrorHandler } from "../utils/error.utils";
import { PaginateUtils } from "../utils/pagination.utils";

export class ProductDiscountService {
  static async getProductDiscount(query: PaginationQuery) {
    try {
      const { page, limit, offset } = PaginateUtils.paginate(query);
      
      const [productsDiscounts, totalItems] = await Promise.all([
        ProductDiscountRepository.findProductDiscounts(offset, limit),
        ProductDiscountRepository.count()
      ]);

      const meta = PaginateUtils.buildMeta({
        totalItems,
        currentPage: page,
        itemsPerPage: limit,
        itemCount: productsDiscounts.length,
      });

      return { productsDiscounts, meta };
    } catch (error) {
      throw error;
    }
  }

  static async create(payload: ProductDiscountCreateRequest) {
    try {
      const productDiscountData: ProductDiscount = {
        productId: payload.productId,
        discountId: payload.discountId,
        isActive: true
      }

      const findProductDiscount = await ProductDiscountRepository.findProductAndDiscount(productDiscountData.productId, productDiscountData.discountId);
      if (findProductDiscount) {
        throw new ErrorHandler(409, "Discount already assigned to product");
      }

      const product = await ProductRepository.findProductById(productDiscountData.productId);
      if (!product) {
        throw new ErrorHandler(404, "Product not found");
      }

      const discount = await DiscountRepository.findDiscountById(productDiscountData.discountId);
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

      const productDiscount = await ProductDiscountRepository.create(productDiscountData);
      return productDiscount;
    } catch (error) {
      throw error;
    }
  }

  static async update(productDiscountId: number, payload: ProductDiscountUpdateRequest) {
    try {
      const productDiscount = await ProductDiscountRepository.findProductDiscountById(productDiscountId);
      if (!productDiscount) {
        throw new ErrorHandler(404, "Product discount not found");
      }

      const discount = await DiscountRepository.findDiscountIsActive(payload.discountId);
      if (!discount) {
        throw new ErrorHandler(400, "Discount not active or expired");
      }

      const existing = await ProductDiscountRepository.findProductAndDiscount(
        productDiscount.productId,
        payload.discountId
      );
      if (existing && existing.id !== productDiscountId) {
        throw new ErrorHandler(409, "Product already has this discount");
      }

      const updatedRow = await ProductDiscountRepository.update(productDiscountId, {
        discountId: payload.discountId,
        isActive: true
      });

      await ProductDiscountRepository.deactivateOtherDiscounts(productDiscount.productId, productDiscountId);

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
