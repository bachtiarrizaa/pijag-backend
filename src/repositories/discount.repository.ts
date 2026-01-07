import prisma from "../config/prisma.config";
import { DiscountCreateRequest, DiscountUpdateRequest } from "../types/discount";

export class DiscountRepository {
  static async create(payload: DiscountCreateRequest) {
    try {
      const discount = await prisma.discount.create({
        data: {
          name: payload.name,
          description: payload.description,
          type: payload.type,
          value: payload.value,
          startDate: payload.startDate ? new Date(payload.startDate) : null,
          endDate: payload.endDate ? new Date(payload.endDate) : null,
          isActive: payload.isActive ?? true
        },
      });
      return discount;
    } catch (error) {
      throw error;
    };
  };

  static async findDiscounts(type?: string) {
    try {
      const discounts = await prisma.discount.findMany({
        where: {
          type: type ? (type as any) : undefined
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      return discounts;
    } catch (error) {
      throw error;
    };
  };

  static async findDiscountById(discountId: number) {
    try {
      const discount = await prisma.discount.findFirst({
        where: { id: discountId }
      });
      return discount;
    } catch (error) {
      throw error;
    };
  };

  static async findDiscountByName(name: string, discountId: number) {
    try {
      const discount = await prisma.discount.findFirst({
        where: {
          name,
          NOT: { id: discountId }
        }
      });
      return discount;
    } catch (error) {
      throw error;
    };
  };

  static async update(discountId: number, payload: DiscountUpdateRequest) {
    try {
      const discount = await prisma.discount.update({
        where: { id: discountId },
        data: {
          name: payload.name,
          description: payload.description,
          type: payload.type,
          value: payload.value,
          startDate: payload.startDate ? new Date(payload.startDate) : null,
          endDate: payload.endDate ? new Date(payload.endDate) : null,
          isActive: payload.isActive
        }
      });
      return discount;
    } catch (error) {
      throw error;
    };
  };

  static async delete(discountId: number) {
    try {
      const discount = await prisma.discount.delete({
        where: { id: discountId }
      });
      return discount;
    } catch (error) {
      throw error;
    };
  };
}