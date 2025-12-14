import { Request, Response } from "express";
import { sendSuccess, sendError } from "../../utils/respon.handler";
import { createRoleService, deleteRoleService, getAllRoleService, updateRoleService } from "../../services/role/role.service";

export const createRoleController = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const createdRole = await createRoleService(name);
    return sendSuccess(res, 201, "Role create successfully", createdRole);
  } catch (error: any) {
    console.error("CreateRole Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const getAllRoleController = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await getAllRoleService();
    return sendSuccess(res, 200, "All roles fetched successfully", roles);
  } catch (error: any) {
    console.error("GetAllRoles Error", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const updateRoleController = async(req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !id) {
      return sendError (res, 400, "Role name and id is reuqired");
    };

    const roleId = parseInt(id, 10)
    if (isNaN(roleId)){
      return sendError (res, 400, "Invalid role ID")
    }

    const updatedRole = await updateRoleService(roleId, name);
    return sendSuccess(res, 201, "Role updated successfully", updatedRole);
  } catch (error: any) {
    console.error("GetAllRoles Error", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const deleteRoleController = async (req: Request, res:Response): Promise<void> => {
  try {
    const { id }= req.params;
    
    if (!id) {
      return sendError(res, 400, "Category ID is required");
    }

    const roleId = parseInt(id, 10)
    if (isNaN(roleId)) {
      return sendError(res, 400, "Category ID must be a number");
    }

    const role = await deleteRoleService(roleId);
    return sendSuccess(res, 200, "Role deleted successfully", role);
  } catch (error: any) {
    console.error("DeleteRole Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  } 
}