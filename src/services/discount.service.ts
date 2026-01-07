import { DiscountRepository } from "../repositories/discount.repository";
import { DiscountCreateRequest, DiscountUpdateRequest } from "../types/discount";
import { ErrorHandler } from "../utils/error.utils";

export class DiscountService {
  static async create(payload: DiscountCreateRequest) {
    try {
      if (!payload.name || payload.name.trim() === "") {
        throw new ErrorHandler(400, "Name cannot be empty");
      }

      if (!["percent", "fixed"].includes(payload.type)) {
        throw new ErrorHandler(400, "Invalid discount type");
      }

      if (payload.value <= 0) {
        throw new ErrorHandler(400, "Discount value must be greater than 0");
      }
      if (payload.type === "percent" && payload.value > 100) {
        throw new ErrorHandler(400, "Percent discount cannot exceed 100%");
      }

      if (payload.startDate && payload.endDate) {
        const start = new Date(payload.startDate);
        const end = new Date(payload.endDate);
        
        if (start >= end) {
          throw new ErrorHandler(400, "Start date must be before end date");
        }
      }

      const discount = await DiscountRepository.create(payload);
      return discount;
    } catch (error) {
      throw error;
    };
  };

  static async getDiscounts(type?: string) {
    try {
      if (type && !["percent", "fixed"].includes(type)) {
        throw new ErrorHandler(400, "Invalid discount type query");
      }
      const discounts = await DiscountRepository.findDiscounts();
      return discounts;
    } catch (error) {
      throw error;
    };
  };

  static async update(discountId: number, payload: DiscountUpdateRequest) {
    try {
      const discount = await DiscountRepository.findDiscountById(discountId);
      if (!discount) {
        throw new ErrorHandler(404, "Discount not found");
      };

      if (payload.name && payload.name.trim() === "") {
        const existing = await DiscountRepository.findDiscountByName(payload.name, discountId);
        if (existing) {
          throw new ErrorHandler(409, "Discount Name already exist");
        };
      };

      if (payload.value <= 0) {
        throw new ErrorHandler(400, "Discount value must be greater than 0");
      };

      if (payload.type && !["percent", "fixed"].includes(payload.type)) {
        throw new ErrorHandler(400, "Invalid discount type");
      };

      if (payload.type && payload.value > 100) {
        throw new ErrorHandler(400, "Percent discount cannot exceed 100%");
      };

      if (payload.startDate && payload.endDate) {
        const start = new Date(payload.startDate);
        const end = new Date(payload.endDate);
        
        if (start >= end) {
          throw new ErrorHandler(400, "Start date must be before end date");
        }
      };

      const updateDiscount = await DiscountRepository.update(discountId, payload);
      return updateDiscount;
    } catch (error) {
      throw error;
    };
  };

  static async delete(discountId: number) {
    try {
      const findDiscount = await DiscountRepository.findDiscountById(discountId);
      if (!discountId) {
        throw new ErrorHandler(404, "Discount not found")
      };

      const deleteDiscount = await DiscountRepository.delete(discountId);
    } catch (error) {
      throw error;
    };
  };
}
