import prisma from "../config/prisma.config";
import { ShiftCreateRequest, ShiftUpdateRequest } from "../types/shift";

export class ShiftRepository {
  static async findOpenShift(userId: number) {
    try {
      const openShift = await prisma.shift.findFirst({
        where: {
          userId,
          status: "open"
        },
      });
      return openShift;
    } catch (error) {
      throw error;
    };
  };

  static async create(userId: number, payload: ShiftCreateRequest) {
    try {
      const shift = await prisma.shift.create({
        data: {
          userId,
          startTime: new Date(),
          cashStart: payload.cashStart,
          notes: payload.notes ?? null,
          status: "open"
        }
      });
      return shift;
    } catch (error) {
      throw error;
    };
  };

  static async closeShift(shiftId: number, payload: ShiftUpdateRequest) {
    try {
      const shift = await prisma.shift.update({
        where: { id: shiftId },
        data: {
          endTime: new Date(),
          cashEnd: payload.cashEnd,
          notes: payload.notes ?? null,
          status: "closed"
        }
      });
      return shift
    } catch (error) {
      throw error;
    };
  };
}