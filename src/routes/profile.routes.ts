import { Router } from "express";
import { uploadAvatar } from "../middleware/uploadImg.middleware";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { ProfileController } from "../controllers/profile.controller";

const router = Router();

router.get("/", AuthMiddleware.authenticateToken, ProfileController.getProfile);
router.put("/update", AuthMiddleware.authenticateToken, uploadAvatar, ProfileController.update);

export default router;