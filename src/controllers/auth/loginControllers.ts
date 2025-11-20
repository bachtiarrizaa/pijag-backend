import { loginServices } from "../../services/auth/loginServices"
import { sendSuccess, sendError } from "../../utils/respon.handler";
import { Request, Response } from "express";

export const loginControllers = async (req: Request, res: Response) => {
  try {
    const login = await loginServices(req.body);
    return sendSuccess(
      res, 200, "Login successfully",
      login
    );
  } catch (error: any) {
    console.error("LoginController Error:", error.message);
    return sendError(
      res, error.statusCode || 400, error.message || "Failed to login"
    )
  }
}