import { NextFunction, Request, Response } from "express";
import { VoucherCreateRequest, VoucherUpdateRequest } from "../types/voucher";
import { VoucherService } from "../services/voucher.service";
import { ErrorHandler } from "../utils/error.utils";
import { PaginateUtils } from "../utils/pagination.utils";

export class VoucherController {
  static async getVouchers(req: Request, res: Response, next: NextFunction) {
    try {
      const paginationQuery = PaginateUtils.parse(req.query);
      const { vouchers, meta } = await VoucherService.getVouchers(paginationQuery);
      
      res.status(200).json({
        success: true,
        message: "Fetched all vouchers successfully",
        data: vouchers,
        meta
      });
    } catch (error) {
      next(error);
    };
  };

  static async getVoucherById(req: Request, res: Response, next: NextFunction) {
    try {
      const voucherId = Number(req.params.id);
      const voucher = await VoucherService.getVoucherById(voucherId);
      res.status(200).json({
        success: true,
        message: "Get voucher successfully",
        data: voucher
      });
    } catch (error) {
      next(error);
    };
  };
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as VoucherCreateRequest;
      const voucher = await VoucherService.create(payload);
      res.status(201).json({
        success: true,
        message: "Voucher created successfully",
        data: voucher
      });
    } catch (error) {
      next(error);
    };
  };

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const voucherId = Number(req.params.id);
      if (!voucherId) {
        throw new ErrorHandler(400, "Voucher Id is required");
      };

      const payload = req.body as VoucherUpdateRequest;

      const voucher = await VoucherService.update(voucherId, payload);
      res.status(200).json({
        success: true,
        message: "Voucher updated successfullt",
        data: voucher
      });
    } catch (error) {
      next(error);
    };
  };

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const voucherId = Number(req.params.id);
      if (!voucherId) {
        throw new ErrorHandler(400, "Voucher Id is required");
      };

      const voucher = await VoucherService.updateStatus(voucherId);
      res.status(200).json({
        success: true,
        message: "Voucher status updates successfully",
        data: voucher
      });
    } catch (error) {
      next(error);
    };
  };

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const voucherId = Number(req.params.id);
      if (!voucherId) {
        throw new ErrorHandler(400, "Voucher Id is required");
      };

      const voucher = await VoucherService.delete(voucherId);
      res.status(200).json({
        success: true,
        message: "Voucher deleted successfully"
      });
    } catch (error) {
      throw error;
    };
  };
}