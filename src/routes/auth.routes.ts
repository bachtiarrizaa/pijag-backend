import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticateToken, authController.logout);
export default router;