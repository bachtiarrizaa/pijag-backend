import {
  endShiftService,
  startShiftService
} from "../../services/shift/shift.service";
import { sendSuccess, sendError } from "../../utils/respon.handler"
import { Request, Response } from "express"

export const startShiftController = async(req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const startShift = await startShiftService(userId, req.body);
    return sendSuccess(
      res, 201, "Shift started successfully",
      startShift
    );
  } catch (error: any) {
    console.error("StartShift Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const endShiftController = async(req: Request, res: Response)=> {
  try {
    const userId = req.user?.id;

    const endShift = await endShiftService(userId, req.body);
    return sendSuccess(
      res, 201, "End Shift successfully",
      endShift
    )
  } catch (error: any) {
    console.error("StartShift Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}