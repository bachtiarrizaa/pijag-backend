import { Request, Response } from "express";
import { Login, Register } from "../types/auth/auth";
import { AuthService } from "../services/auth.service";

export class AuthController {
  async register (req: Request, res: Response) {
    try {
      const payload: Register = req.body;

      const authService = new AuthService();
      const register = await authService.register(payload);
      res.status(201).json({
        success: true,
        message: "Register successfully",
        data: register,
      });
    } catch (error) {
      throw error;
    };
  };

  async login (req: Request, res: Response) {
    try {
      const payload: Login = req.body;

      const authService = new AuthService();
      const login = await authService.login(payload);
      res.status(201).json({
        success: true,
        message: "Login successfully",
        data: login,
      });
    } catch (error) {
      throw error
    };
  };

  async logout (req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Token is required for logout",
        });
      }

      const authService = new AuthService();
      await authService.logout(token);

      return res.status(200).json({
        success: true,
        message: "Logout successfully",
      });
    } catch (error) {
      throw error;
    }
  }
}