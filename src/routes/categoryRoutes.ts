import { Router } from "express";
import { isAdmin } from "../middleware/auth.middleware";
import { createCategoryControllers, deleteCategoryController, getAllCategoriesControllers, getCategoryByIdControllers, updatedCategoryControllers } from "../controllers/category/categoryControllers";

const router = Router();

router.post("/create", isAdmin, createCategoryControllers);
router.get("/", getAllCategoriesControllers);
router.get("/:id", getCategoryByIdControllers);
router.put("/:id", updatedCategoryControllers);
router.delete("/:id", isAdmin, deleteCategoryController)

export default router; 