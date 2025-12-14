import { Router } from "express";
import {
    createProductController,
    deleteProductController,
    getAllProductController,
    getProductByCategoryController,
    getProductByIdController,
    updatedProductController
} from "../controllers/product/product.controller";
import { isAdmin } from "../middleware/auth.middleware";
import { uploadImgProduct } from "../middleware/uploadImg.middleware";

const router = Router();

router.post("/create", isAdmin, uploadImgProduct,createProductController);
router.get("/category", getProductByCategoryController);
router.get("/", getAllProductController);
router.get("/:id", getProductByIdController);
router.put("/:id", isAdmin, uploadImgProduct, updatedProductController);
router.delete("/:id", isAdmin, deleteProductController);

export default router;