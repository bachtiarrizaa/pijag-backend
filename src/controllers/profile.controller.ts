import { NextFunction, Request, Response } from "express";
import { UserUpdateRequest } from "../types/user";
import { ProfileService } from "../services/profile.service";
import { ErrorHandler } from "../utils/error.utils";

export class ProfileController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id); 
      if (!userId) {
        throw new ErrorHandler(401, "Unauthorized")
      }

      const user = await ProfileService.getProfile(userId);
      res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: user
      });
    } catch (error) {
      next(error);
    };
  };

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        throw new ErrorHandler(401, "Unauthorized")
      }
      const payload = req.body as UserUpdateRequest;
      if (req.file) {
        payload.avatar = req.file?.filename
      };

      const user = await ProfileService.update(userId, payload);
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user
      });
    } catch (error) {
      next(error);
    };
  };
}