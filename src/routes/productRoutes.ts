import { Router } from "express";
import { createProductControllers } from "../controllers/product/productControllers";
import { isAdmin } from "../middleware/authMiddleware";
import { uploadImgProduct } from "../middleware/uploadImgMiddleware";

const router = Router();

router.post("/create", isAdmin, uploadImgProduct,createProductControllers);

export default router;