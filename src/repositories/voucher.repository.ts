import prisma from "../config/prisma.config";
import { VoucherCreateRequest, VoucherUpdateRequest } from "../types/voucher";

export class VoucherRepository {
  static async findVouchers() {
    try {
      const vouchers = await prisma.voucher.findMany({
        orderBy: {
          createdAt: "desc"
        }
      });
      return vouchers;
    } catch (error) {
      throw error;
    };
  };

  static async findVoucherById(voucherId: number) {
    try {
      const voucher = await prisma.voucher.findFirst({
        where: { id: voucherId }
      });
      return voucher;
    } catch (error) {
      throw error;
    };
  };

  static async findVoucherByName(name: string, voucherId: number) {
    try {
      const voucher = await prisma.voucher.findFirst({
        where: {
          name,
          NOT: { id: voucherId }
        }
      });
      return voucher;
    } catch (error) {
      throw error;
    };
  };

  static async create(payload: VoucherCreateRequest) {
    try {
      const voucher = await prisma.voucher.create({
        data: {
          name: payload.name,
          description: payload.description ?? null,
          type: payload.type,
          value: payload.value,
          minOrder: payload.minOrder ?? null,
          startDate: payload.startDate ? new Date(payload.startDate) : null,
          endDate: payload.endDate ? new Date(payload.endDate) : null,
          isActive: true
        }
      });
      return voucher;
    } catch (error) {
      throw error;
    };
  };

  static async update(voucherId: number, payload: VoucherUpdateRequest) {
    try {
      const voucher = await prisma.voucher.update({
        where: { id: voucherId },
        data: {
          name: payload.name,
          description: payload.description ?? null,
          type: payload.type,
          value: payload.value,
          minOrder: payload.minOrder ?? null,
          startDate: payload.startDate ? new Date(payload.startDate) : null,
          endDate: payload.endDate ? new Date(payload.endDate) : null
        }
      });
      return voucher;
    } catch (error) {
      throw error;
    };
  };

  static async updateStatus(voucherId: number, isActive: boolean) {
    try {
      const voucher = await prisma.voucher.update({
        where: { id: voucherId },
        data: { isActive }
      });
      return voucher;
    } catch (error) {
      throw error;
    };
  };

  static async delete(voucherId: number) {
    try {
      const voucher = await prisma.voucher.delete({
        where: { id: voucherId }
      });
      return voucher;
    } catch (error) {
      throw error;
    };
  };
}