import { ShiftRepository } from "../repositories/shift.repository";
import { ShiftCreateRequest, ShiftUpdateRequest } from "../types/shift";
import { ErrorHandler } from "../utils/error.utils";

export class ShiftService{
  static async openShift(userId: number, payload: ShiftCreateRequest) {
    try {
      const openShiftData = {
        cashStart: payload.cashStart,
        notes: payload.notes ?? null
      };

      const findOpenShift = await ShiftRepository.findOpenShift(userId);
      if (findOpenShift) {
        throw new ErrorHandler(400, "You still have an active shift");
      };

      if (!openShiftData.cashStart) {
        throw new ErrorHandler(400, "Cash start is required");
      };

      const openShift = await ShiftRepository.create(userId, openShiftData);
      return openShift;
    } catch (error) {
      throw error;
    };
  };

  static async closeShift(userId: number, payload: ShiftUpdateRequest) {
    try {
      const closedShiftData = {
        cashEnd: payload.cashEnd,
        notes: payload.notes ?? null
      }

      const findOpenShift = await ShiftRepository.findOpenShift(userId);
      if (!findOpenShift) {
        throw new ErrorHandler(404, "No active shift found!");
      };

      if (!closedShiftData.cashEnd) {
        throw new ErrorHandler(400, "Cash end is required");
      };

      const closeShift = await ShiftRepository.closeShift(findOpenShift.id, closedShiftData);
      return closeShift;
    } catch (error) {
      throw error;
    };
  };
}