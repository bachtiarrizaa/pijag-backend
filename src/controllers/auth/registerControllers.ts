
import { registerServices } from "../../services/auth/registerServices";
import { Request, Response } from "express"
import { sendSuccess, sendError } from "../../utils/respon.handler";

export const registerControllers = async (req: Request, res: Response) => {
  try {
   const user = await registerServices(req.body);
    return sendSuccess(
      res, 200, "Register successfulyy",
      user,
    )
  } catch (error: any) {
    console.error("RegisterController Error:", error.message);
    return sendError(
      res,
      error.statusCode || 400,
      error.message || "Failed to register user"
    )
  }
}