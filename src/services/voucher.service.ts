import { VoucherRepository } from "../repositories/voucher.repository";
import { Voucher, VoucherCreateRequest, VoucherUpdateRequest } from "../types/voucher";
import { ErrorHandler } from "../utils/error.utils";

export class VoucherService {
  static async getVouchers() {
    try {
      const vouchers = await VoucherRepository.findVouchers();
      return vouchers;
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
    } catch(error) {
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

      if (!["percent", "fixed"].includes(voucherData.type)) {
        throw new ErrorHandler(400, "Invalid discount type");
      };

      if (voucherData.value <= 0) {
        throw new ErrorHandler(400, "Discount value must be greater than 0");
      };

      if (voucherData.type === "percent" && voucherData.value > 100) {
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

      if (!["percent", "fixed"].includes(voucherData.type)) {
        throw new ErrorHandler(400, "Invalid discount type");
      };

      if (voucherData.value <= 0) {
        throw new ErrorHandler(400, "Discount value must be greater than 0");
      };

      if (voucherData.type === "percent" && voucherData.value > 100) {
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
    } catch (error) {
      throw error;
    };
  };
}