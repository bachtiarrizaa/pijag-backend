import { NextFunction, Request, Response } from "express";
import { ShiftCreateRequest, ShiftUpdateRequest } from "../types/shift";
import { ShiftService } from "../services/shift.service";

export class ShiftController{
  static async startShift(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      const payload = req.body as ShiftCreateRequest;

      const startShift = await ShiftService.openShift(userId, payload);
      res.status(200).json({
        success: true,
        message: "Shift started successfully",
        data: startShift
      });
    } catch (error) {
      next(error);
    };
  };

  static async closeShift(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const payload = req.body as ShiftUpdateRequest;

      const closeShift = await ShiftService.closeShift(userId, payload);
      res.status(200).json({
        success: true,
        message: "End Shift successfully",
        data: closeShift
      });
    } catch (error) {
      next(error);
    };
  };
}