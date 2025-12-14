import { registerService } from "../../services/auth/register.service";
import { loginService } from "../../services/auth/login.service";
import { logoutService } from "../../services/auth/logout.service";
import { sendSuccess, sendError } from "../../utils/respon.handler";
import { Request, Response } from "express";

export const registerController = async (req: Request, res: Response) => {
  try {
   const user = await registerService(req.body);
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

export const loginController = async (req: Request, res: Response) => {
  try {
      const login = await loginService(req.body);
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
}