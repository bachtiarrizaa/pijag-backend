import { Router } from "express";
import { uploadImgProduct } from "../middleware/uploadImg.middleware";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { ProductController } from "../controllers/product.controller";

const router = Router();

router.post("/create", AuthMiddleware.isAdmin, uploadImgProduct, ProductController.create);
router.get("/", ProductController.getProducts)
router.get("/:id", ProductController.getProductById);
router.put("/:id", AuthMiddleware.isAdmin, uploadImgProduct, ProductController.update);
router.delete("/:id", AuthMiddleware.isAdmin, ProductController.delete);

export default router;