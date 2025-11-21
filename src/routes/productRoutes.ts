import { Router } from "express";
import { createProductControllers, getAllProductControllers, getProductByCategoryControllers, getProductByIdControllers } from "../controllers/product/productControllers";
import { isAdmin } from "../middleware/authMiddleware";
import { uploadImgProduct } from "../middleware/uploadImgMiddleware";

const router = Router();

router.post("/create", isAdmin, uploadImgProduct,createProductControllers);
router.get("/category", getProductByCategoryControllers);
router.get("/", getAllProductControllers);
router.get("/:id", getProductByIdControllers);

export default router;