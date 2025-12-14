import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { uploadAvatar } from "../middleware/uploadImg.middleware";
import { getProfileController, updatedUserController } from "../controllers/profile/profile.controller";

const router = Router();

router.get("/", authenticateToken, getProfileController);
router.put("/update", authenticateToken, uploadAvatar, updatedUserController);

export default router;