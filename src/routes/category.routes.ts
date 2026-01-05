import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { CategoryController } from "../controllers/category.controller";

const router = Router();
router.use(AuthMiddleware.isAdmin);

router.post("/create", CategoryController.create);
router.get("/", CategoryController.getCategories);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.delete)

export default router; 