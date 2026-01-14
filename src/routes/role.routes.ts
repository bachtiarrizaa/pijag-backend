import Router from "express";
import { RoleController } from "../controllers/role.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(AuthMiddleware.isAdmin);

router.post("/", RoleController.create);
router.get("/", RoleController.getRoles);
router.put("/:id", RoleController.update);
router.delete("/:id", RoleController.delete);

export default router;