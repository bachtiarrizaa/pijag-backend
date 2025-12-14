import Router from "express";
import {
  createRoleController,
  deleteRoleController,
  getAllRoleController,
  updateRoleController
} from "../controllers/role/role.controller";
import { isAdmin } from "../middleware/auth.middleware";

const router = Router();

router.use(isAdmin);

router.post("/", createRoleController);
router.get("/", getAllRoleController);
router.put("/:id", updateRoleController);
router.delete("/:id", deleteRoleController);

export default router;