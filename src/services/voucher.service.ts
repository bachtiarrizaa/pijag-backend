import { VoucherRepository } from "../repositories/voucher.repository";
import { PaginationQuery } from "../types/pagination";
import { Voucher, VoucherCreateRequest, VoucherUpdateRequest } from "../types/voucher";
import { ErrorHandler } from "../utils/error.utils";
import { PaginateUtils } from "../utils/pagination.utils";
import { DiscountType } from "@prisma/client";

export class VoucherService {
  static async getVouchers(query: PaginationQuery) {
    try {
      const { page, limit, offset } = PaginateUtils.paginate(query);

      const [vouchers, totalItems] = await Promise.all([
        VoucherRepository.findVouchers(offset, limit),
        VoucherRepository.count()
      ]);

      const meta = PaginateUtils.buildMeta({
        totalItems,
        currentPage: page,
        itemsPerPage: limit,
        itemCount: vouchers.length,
      });

      return { vouchers, meta };
    } catch (error) {
      throw error;
    };
  };

  static async getVoucherById(voucherId: number) {
    try {
      const voucher = await VoucherRepository.findVoucherById(voucherId);
      if (!voucher) {
        throw new ErrorHandler(404, "Voucher not found");
      };
      return voucher;
    } catch (error) {
      throw error;
    };
  };

  static async create(payload: VoucherCreateRequest) {
    try {
      const voucherData: Voucher = {
        name: payload.name,
        description: payload.description ?? null,
        type: payload.type,
        value: payload.value,
        minOrder: payload.minOrder ?? null,
        startDate: payload.startDate ?? null,
        endDate: payload.endDate ?? null,
        isActive: payload.isActive
      }

      if (!voucherData.name || voucherData.name.trim() === "") {
        throw new ErrorHandler(400, "Name cannot be empty");
      };

      if (![DiscountType.percent, DiscountType.fixed].includes(voucherData.type)) {
        throw new ErrorHandler(400, "Invalid discount type");
      };

      if (voucherData.value <= 0) {
        throw new ErrorHandler(400, "Discount value must be greater than 0");
      };

      if (voucherData.type === DiscountType.percent && voucherData.value > 100) {
        throw new ErrorHandler(400, "Percent discount cannot exceed 100%");
      };

      if (voucherData.startDate && voucherData.endDate) {
        if (voucherData.startDate >= voucherData.endDate) {
          throw new ErrorHandler(400, "Start date must be before end date");
        };
      };

      const voucher = await VoucherRepository.create(voucherData);
      return voucher;
    } catch (error) {
      throw error;
    };
  };

  static async update(voucherId: number, payload: VoucherUpdateRequest) {
    try {
      const voucherData = {
        name: payload.name,
        description: payload.description ?? null,
        type: payload.type,
        value: payload.value,
        minOrder: payload.minOrder ?? null,
        startDate: payload.startDate ? new Date(payload.startDate) : null,
        endDate: payload.endDate ? new Date(payload.endDate) : null
      }

      const findVoucher = await VoucherRepository.findVoucherById(voucherId);
      if (!findVoucher) {
        throw new ErrorHandler(404, "Voucher not found");
      };

      if (voucherData.name && voucherData.name.trim() === "") {
        const existing = await VoucherRepository.findVoucherByName(voucherData.name, voucherId);
        if (existing) {
          throw new ErrorHandler(409, "Discount Name already exist")
        }
      };

      if (![DiscountType.percent, DiscountType.fixed].includes(voucherData.type)) {
        throw new ErrorHandler(400, "Invalid discount type");
      };

      if (voucherData.value <= 0) {
        throw new ErrorHandler(400, "Discount value must be greater than 0");
      };

      if (voucherData.type === DiscountType.percent && voucherData.value > 100) {
        throw new ErrorHandler(400, "Percent discount cannot exceed 100%");
      };

      if (voucherData.startDate && voucherData.endDate) {
        if (voucherData.startDate >= voucherData.endDate) {
          throw new ErrorHandler(400, "Start date must be before end date");
        };
      };

      const voucher = await VoucherRepository.update(voucherId, voucherData);
      return voucher;
    } catch (error) {
      throw error;
    };
  };

  static async updateStatus(voucherId: number) {
    try {
      const findVoucher = await VoucherRepository.findVoucherById(voucherId);
      if (!findVoucher) {
        throw new ErrorHandler(404, "Voucher not found");
      };

      const voucher = await VoucherRepository.updateStatus(
        voucherId,
        !findVoucher.isActive
      );
      return voucher;
    } catch (error) {
      throw error;
    };
  };

  static async delete(voucherId: number) {
    try {
      const findVoucher = await VoucherRepository.findVoucherById(voucherId);
      if (!findVoucher) {
        throw new ErrorHandler(404, "Voucher not found");
      };

      const voucher = await VoucherRepository.delete(voucherId);
      return voucher;
    } catch (error) {
      throw error;
    };
  };
}