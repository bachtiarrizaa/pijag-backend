import { RoleRepository } from "../repositories/role.repository";
import { Role, RoleCreateRequest, RoleUpdateRequest } from "../types/role";
import { ErrorHandler } from "../utils/error.utils";

export class RoleService{
  static async create(payload: RoleCreateRequest) {
    try {
      const roleData: Role = {
        name: payload.name
      };

      const existingRole = await RoleRepository.findRoleByName(payload.name)
      if (existingRole) {
        throw new ErrorHandler(409, "Role already exist!");
      };

      const role = await RoleRepository.create(roleData);
      return role;
    } catch (error) {
      throw error;
    };
  };

  static async getRoles() {
    try {
      const roles = await RoleRepository.findRoles();
      return roles;
    } catch (error) {
      throw error;
    };
  };

  static async update(roleId: number, payload: RoleUpdateRequest) {
    try {
      const roleModel: Role = {
        name: payload.name
      };

      const findRole = await RoleRepository.findRoleById(roleId);
      if (!findRole) {
        throw new ErrorHandler(404, "Role not found");
      };

      const existingRole = await RoleRepository.findDuplicateRole(roleId, payload.name);

      if (existingRole) {
        throw new ErrorHandler(409, "Role already exist");
      };

      const role = await RoleRepository.update(roleId, payload);
      return role
    } catch(error) {
      throw error;
    };
  };

  static async delete(roleId: number) {
    try {
      const findRole = await RoleRepository.findRoleById(roleId);
      if (!findRole) {
        throw new ErrorHandler(404, "Role not found");
      };

      const role = await RoleRepository.delete(roleId);
    } catch (error) {
      throw error;
    };
  };
}