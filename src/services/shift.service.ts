import { ShiftRepository } from "../repositories/shift.repository";
import { ShiftCreateRequest, ShiftUpdateRequest } from "../types/shift";
import { ErrorHandler } from "../utils/error.utils";

export class ShiftService{
  static async openShift(userId: number, payload: ShiftCreateRequest) {
    try {
      const findOpenShift = await ShiftRepository.findOpenShift(userId);
      if (findOpenShift) {
        throw new ErrorHandler(404, "You still have an active shift");
      };

      if (!payload.cashStart) {
        throw new ErrorHandler(400, "Cash start is required");
      };

      const openShift = await ShiftRepository.create(userId, payload);
      return openShift;
    } catch (error) {
      throw error;
    };
  };

  static async closeShift(userId: number, payload: ShiftUpdateRequest) {
    try {
      const findOpenShift = await ShiftRepository.findOpenShift(userId);
      if (!findOpenShift) {
        throw new ErrorHandler(404, "No active shift found!");
      };

      if (!payload.cashEnd) {
        throw new ErrorHandler(400, "Cash end is required");
      };

      const closeShift = await ShiftRepository.closeShift(findOpenShift.id, payload);
      return closeShift;
    } catch (error) {
      throw error;
    };
  };
}