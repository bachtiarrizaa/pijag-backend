import prisma from "../config/prisma.config";
import { Role, RoleCreateRequest, RoleUpdateRequest } from "../types/role";

export class RoleRepository{
  static async create(payload: RoleCreateRequest) {
    try {
      const role = await prisma.role.create({
        data: {
          name: payload.name
        },
      });

      return role
    } catch (error) {
      throw error;
    };
  };

  static async findRoles(){
    try {
      const roles = await prisma.role.findMany({
        orderBy: {
          createdAt: "desc"
        }
      });
      return roles;
    } catch (error) {
      throw error;
    }
  };

  static async findRoleById(roleId: number){
    try {
      const role = await prisma.role.findUnique({
        where: { id: roleId }
      });
      return role;
    } catch (error) {
      throw error;
    }
  };

  static async findRoleByName(name: string){
    try {
      const role = await prisma.role.findFirst({
        where: { name }
      });
      return role;
    } catch (error) {
      throw error;
    };
  };

  static async findDuplicateRole(roleId: number, name: string){
    try {
      const role = await prisma.role.findFirst({
        where: {
          name,
          NOT: { id: roleId }
        },
      });
      return role;
    } catch (error) {
      throw error;
    }
  }

  static async update(roleId: number, payload: RoleUpdateRequest){
    try {
      const role = await prisma.role.update({
        where: { id: roleId },
        data: {
          name: payload.name
        },
      });
      return role;
    } catch (error) {
      throw error;
    };
  };

  static async delete(roleId: number) {
    try {
      const role = await prisma.role.delete({
        where: { id: roleId }
      });
    } catch (error) {
      throw error;
    }
  }
}