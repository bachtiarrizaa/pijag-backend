import prisma from "../config/prisma.config";
import { RoleRepository } from "../repositories/role.repository";
import { PaginationQuery } from "../types/pagination";
import { Role, RoleCreateRequest, RoleUpdateRequest } from "../types/role";
import { ErrorHandler } from "../utils/error.utils";
import { PaginateUtils } from "../utils/pagination.utils";

export class RoleService{
  static async create(payload: RoleCreateRequest) {
    try {
      const roleData: Role = {
        name: payload.name
      };

      const existingRole = await RoleRepository.findRoleByName(roleData.name)
      if (existingRole) {
        throw new ErrorHandler(409, "Role already exist!");
      };

      const role = await RoleRepository.create(roleData);
      return role;
    } catch (error) {
      throw error;
    };
  };

  static async getRoles(query: PaginationQuery) {
    const { page, limit, offset } = PaginateUtils.paginate(query);

    const [roles, totalItems] = await Promise.all([
      RoleRepository.findRoles(offset, limit),
      RoleRepository.count()
    ]);

    const meta = PaginateUtils.buildMeta({
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
      itemCount: roles.length,
    });


    return {
      roles,
      meta
    };
  }

  static async update(roleId: number, payload: RoleUpdateRequest) {
    try {
      const roleData: Role = {
        name: payload.name
      };

      const findRole = await RoleRepository.findRoleById(roleId);
      if (!findRole) {
        throw new ErrorHandler(404, "Role not found");
      };

      const existingRole = await RoleRepository.findDuplicateRole(roleId, roleData.name);

      if (existingRole) {
        throw new ErrorHandler(409, "Role already exist");
      };

      const role = await RoleRepository.update(roleId, roleData);
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