import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/respon.handler";
import { User } from "../../types/user";
import { getProfileService, updateProfileService } from "../../services/profile/profile.service";

export const getProfileController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const profile = await getProfileService(userId);
    return sendSuccess(res, 200, "User profile fetched successfully", profile);
  } catch (error: any) {
    console.error("UpdateProfile Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const updatedUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendError(res, 401, "Unauthorized");
    }

    const payload: User = {...req.body};

    if (req.file) {
      payload.avatar = req.file?.filename
    }

    const updatedUser = await updateProfileService(userId, payload);
    return sendSuccess(res, 200, "Profile updates successfully", updatedUser);
  } catch (error: any) {
    console.error("UpdateProfile Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}