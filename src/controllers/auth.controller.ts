import { Request, Response, NextFunction } from "express";
import { LoginRequest, RegisterRequest } from "../types/auth";
import { AuthService } from "../services/auth.service";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as RegisterRequest;
      const register = await AuthService.register(payload);

      res.status(201).json({
        success: true,
        message: "Register successfully",
        data: register,
      });
    } catch (error) {
      next(error);
    }
  }

  async login (req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as LoginRequest;

      const login = await AuthService.login(payload);
      res.status(200).json({
        success: true,
        message: "Login successfully",
        data: login,
      });
    } catch (error) {
      next(error);
    };
  };

  async logout (req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Token is required for logout",
        });
      }

      await AuthService.logout(token);

      return res.status(200).json({
        success: true,
        message: "Logout successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}