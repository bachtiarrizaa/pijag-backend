import { Router } from "express";
import { registerController } from "../controllers/auth/auth.controller";
import { loginController } from "../controllers/auth/auth.controller";
import { logoutController } from "../controllers/auth/auth.controller";
import { authenticateToken } from "../middleware/authMiddleware";
const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", authenticateToken, logoutController)

export default router;