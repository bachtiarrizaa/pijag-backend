import { Router } from "express";
import {
    createProductControllers,
    deleteProductControllers,
    getAllProductControllers,
    getProductByCategoryControllers,
    getProductByIdControllers,
    updatedProductControllers
} from "../controllers/product/productControllers";
import { isAdmin } from "../middleware/auth.middleware";
import { uploadImgProduct } from "../middleware/uploadImg.middleware";

const router = Router();

router.post("/create", isAdmin, uploadImgProduct,createProductControllers);
router.get("/category", getProductByCategoryControllers);
router.get("/", getAllProductControllers);
router.get("/:id", getProductByIdControllers);
router.put("/:id", isAdmin, uploadImgProduct, updatedProductControllers);
router.delete("/:id", isAdmin, deleteProductControllers);

export default router;