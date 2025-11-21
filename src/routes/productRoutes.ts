import { Router } from "express";
import { createProductControllers, deleteProductControllers, getAllProductControllers, getProductByCategoryControllers, getProductByIdControllers } from "../controllers/product/productControllers";
import { isAdmin } from "../middleware/authMiddleware";
import { uploadImgProduct } from "../middleware/uploadImgMiddleware";

const router = Router();

router.post("/create", isAdmin, uploadImgProduct,createProductControllers);
router.get("/category", getProductByCategoryControllers);
router.get("/", getAllProductControllers);
router.get("/:id", getProductByIdControllers);
router.delete("/:id", isAdmin, deleteProductControllers);

export default router;