import { Request, Response, NextFunction } from "express";
import { RoleCreateRequest, RoleUpdateRequest } from "../types/role";
import { RoleService } from "../services/role.service";
import { ErrorHandler } from "../utils/error.utils";

export class RoleController {
  static async create(req: Request, res: Response, next: NextFunction){
    try {
      const payload = req.body as RoleCreateRequest;
      const role = await RoleService.create(payload);
      res.status(201).json({
        success: true,
        message: "Create role successfully",
        data: role
      });
    } catch (error) {
      next(error);
    };
  }

  static async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await RoleService.getRoles();
      res.status(200).json({
        success: true,
        message: "Success fetch all roles",
        data: roles
      });
    } catch (error) {
      next (error);
    };
  };

  static async update(req: Request, res: Response, next: NextFunction){
    try {
      const roleId = Number(req.params.id);
      if (!roleId) {
        throw new ErrorHandler(400, "Role Id is Required");
      }
      const payload = req.body as RoleUpdateRequest;

      const role = await RoleService.update(roleId, payload);
      res.status(201).json({
        success: true,
        message: "Role update successfully",
        data: role
      });
    } catch (error) {
      next(error);
    };
  };

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const roleId = Number(req.params.id);
      if (!roleId){
        throw new ErrorHandler(400, "Role id is required");
      };

      const role = await RoleService.delete(roleId);
      res.status(200).json({
        success: true,
        message: "Delete successfully"
      })
    } catch (error) {
      next(error);
    };
  };
}