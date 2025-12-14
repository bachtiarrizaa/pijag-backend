import prisma from "../../config/prisma.config";

export const createRoleService = async (name: string) => {
  if (!name) {
    const error: any = new Error("Field name is required");
    error.statusCode = 400;
    throw error;
  }
  const existingRole = await prisma.role.findUnique({
    where: { name }
  });

  if (existingRole) {
    const error: any = new Error ("Role already exist!");
    error.statusCode = 409;
    throw error;
  }

  const createRole = await prisma.role.create({
    data: {
      name
    }
  });

  return createRole;
}

export const getAllRoleService = async () => {
  const getAllRole = await prisma.role.findMany({
    orderBy: {
      created_at: "desc"
    }
  });
  return getAllRole;
}

export const updateRoleService = async (id: number, name: string) => {
  const role = await prisma.role.findUnique({
    where: { id }
  });
  if (!role) {
    const error: any = new Error("Role not found");
    error.statusCode = 404;
    throw error;
  }

  const existingRole = await prisma.role.findFirst({
    where: {
      name,
      NOT: { id },
    },
  });

  if (existingRole) {
    const error: any = new Error("Role already exists!");
    error.statusCode = 409;
    throw error;
  }

  const updatedRole = await prisma.role.update({
    where: { id },
    data: { name },
  });

  return updatedRole;
}

export const deleteRoleService = async (id: number) => {
  const role = await prisma.role.findUnique({
    where: { id }
  });

  if (!role) {
    const error: any = new Error("Role not found!");
    error.statusCode = 404;
    throw error;
  }

  const deleteRole = await prisma.role.delete({
    where: { id }
  });

  // return deleteRole;
}