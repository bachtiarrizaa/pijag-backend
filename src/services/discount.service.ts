import { DiscountRepository } from "../repositories/discount.repository";
import { Discount, DiscountCreateRequest, DiscountType, DiscountUpdateRequest } from "../types/discount";
import { ErrorHandler } from "../utils/error.utils";

export class DiscountService {
  static async create(payload: DiscountCreateRequest) {
    try {
      const discountData: Discount = {
        name: payload.name,
        description: payload.description,
        type: payload.type,
        value: payload.value,
        startDate: payload.startDate ?? null,
        endDate: payload.endDate ?? null,
        isActive: payload.isActive
      }

      if (!discountData.name || discountData.name.trim() === "") {
        throw new ErrorHandler(400, "Name cannot be empty");
      }

      if (!["percent", "fixed"].includes(discountData.type)) {
        throw new ErrorHandler(400, "Invalid discount type");
      }

      if (discountData.value <= 0) {
        throw new ErrorHandler(400, "Discount value must be greater than 0");
      }
      if (discountData.type === "percent" && discountData.value > 100) {
        throw new ErrorHandler(400, "Percent discount cannot exceed 100%");
      }

      if (discountData.startDate && discountData.endDate) {
        if (discountData.startDate >= discountData.endDate) {
          throw new ErrorHandler(400, "Start date must be before end date");
        }
      }

      const discount = await DiscountRepository.create(discountData);
      return discount;
    } catch (error) {
      throw error;
    };
  };

  static async getDiscounts(type?: DiscountType) {
    try {
      if (type && !["percent", "fixed"].includes(type)) {
        throw new ErrorHandler(400, "Invalid discount type query");
      }

      const discounts = await DiscountRepository.findDiscounts(type);
      return discounts;
    } catch (error) {
      throw error;
    };
  };


  static async update(discountId: number, payload: DiscountUpdateRequest) {
    try {
      const discountData: Discount = {
        name: payload.name,
        description: payload.description,
        type: payload.type,
        value: payload.value,
        startDate: payload.startDate ?? null,
        endDate: payload.endDate ?? null,
        isActive: payload.isActive
      }

      const discount = await DiscountRepository.findDiscountById(discountId);
      if (!discount) {
        throw new ErrorHandler(404, "Discount not found");
      };

      if (discountData.name && discountData.name.trim() === "") {
        const existing = await DiscountRepository.findDiscountByName(discountData.name, discountId);
        if (existing) {
          throw new ErrorHandler(409, "Discount Name already exist");
        };
      };

      if (discountData.value <= 0) {
        throw new ErrorHandler(400, "Discount value must be greater than 0");
      };

      if (discountData.type && !["percent", "fixed"].includes(payload.type)) {
        throw new ErrorHandler(400, "Invalid discount type");
      };

      if (discountData.type && payload.value > 100) {
        throw new ErrorHandler(400, "Percent discount cannot exceed 100%");
      };

      if (discountData.startDate && discountData.endDate) {
        if (discountData.startDate >= discountData.endDate) {
          throw new ErrorHandler(400, "Start date must be before end date");
        }
      };

      const updateDiscount = await DiscountRepository.update(discountId, discountData);
      return updateDiscount;
    } catch (error) {
      throw error;
    };
  };

  static async delete(discountId: number) {
    try {
      const findDiscount = await DiscountRepository.findDiscountById(discountId);
      if (!findDiscount) {
        throw new ErrorHandler(404, "Discount not found")
      };

      const deleteDiscount = await DiscountRepository.delete(discountId);
    } catch (error) {
      throw error;
    };
  };
}
