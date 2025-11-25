import { endShiftServices, startShiftServices } from "../../services/shift/shift.services";
import { sendSuccess, sendError } from "../../utils/respon.handler"
import { Request, Response } from "express"

export const startShiftControllers = async(req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const startShift = await startShiftServices(userId, req.body);
    return sendSuccess(
      res, 201, "Shift started successfully",
      startShift
    );
  } catch (error: any) {
    console.error("StartShift Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const endShiftControllers = async(req: Request, res: Response)=> {
  try {
    const userId = req.user?.id;

    const endShift = await endShiftServices(userId, req.body);
    return sendSuccess(
      res, 201, "End Shift successfully",
      endShift
    )
  } catch (error: any) {
    console.error("StartShift Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}