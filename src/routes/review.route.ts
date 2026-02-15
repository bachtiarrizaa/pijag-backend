import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/product/:productId", ReviewController.getProductReviews);

router.post(
    "/",
    AuthMiddleware.authenticateToken,
    ReviewController.create
);

router.get(
    "/",
    AuthMiddleware.authenticateToken,
    AuthMiddleware.authorizeRole(["admin"]),
    ReviewController.getAllReviews
);

router.patch(
    "/:id",
    AuthMiddleware.authenticateToken,
    AuthMiddleware.authorizeRole(["admin"]),
    ReviewController.updateReview
);

router.delete(
    "/:id",
    AuthMiddleware.authenticateToken,
    AuthMiddleware.authorizeRole(["admin"]),
    ReviewController.deleteReview
);

export default router;
