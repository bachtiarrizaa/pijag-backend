import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { ProductController } from "../controllers/product.controller";
import { UploadImgMiddleware } from "../middleware/upload.middleware";

const router = Router();

router.post("/create",
  AuthMiddleware.isAdmin,
  UploadImgMiddleware.uploadImgProduct,
  ProductController.create
);
router.get("/", ProductController.getProducts)
router.get("/:id", ProductController.getProductById);
router.put("/:id",
  AuthMiddleware.isAdmin,
  UploadImgMiddleware.uploadImgProduct,
  ProductController.update
);
router.delete("/:id", AuthMiddleware.isAdmin, ProductController.delete);

export default router;