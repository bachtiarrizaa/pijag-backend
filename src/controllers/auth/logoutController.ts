import { Request, Response } from "express";
import { sendSuccess, sendError } from "../../utils/respon.handler";
import { logoutService } from "../../services/auth/logoutServices";

export const logoutController = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return sendError(res, 401, "Unauthorized: No token provided");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return sendError(res, 401, "Token missing");
    }

    await logoutService(token);
    return sendSuccess(res, 200, "Logout successfully");
  } catch (error: any) {
    console.error("LogoutController Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message || "Failed to logout");
  }
};