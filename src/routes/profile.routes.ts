import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { ProfileController } from "../controllers/profile.controller";
import { UploadImgMiddleware } from "../middleware/upload.middleware";

const router = Router();

router.get("/",
  AuthMiddleware.authenticateToken,
  ProfileController.getProfile
);
router.put("/update",
  AuthMiddleware.authenticateToken,
  UploadImgMiddleware.uploadAvatar,
  ProfileController.update
);

export default router;