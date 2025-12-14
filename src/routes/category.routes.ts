import { Router } from "express";
import { isAdmin } from "../middleware/auth.middleware";
import {
    createCategoryController,
    deleteCategoryController,
    getAllCategoriesController,
    getCategoryByIdController,
    updatedCategoryController
} from "../controllers/category/category.controller";

const router = Router();

router.post("/create", isAdmin, createCategoryController);
router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);
router.put("/:id", updatedCategoryController);
router.delete("/:id", isAdmin, deleteCategoryController)

export default router; 