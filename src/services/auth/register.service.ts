import bcrypt from "bcrypt";
import prisma from "../../config/prisma.config";
import { Register } from "../../types/auth/auth";

export const registerService = async (data:Register) => {
  const { name, username, email, password } = data;

  const existingUsername = await prisma.user.findUnique({
    where: { username }
  });
  if (existingUsername) {
    const error:any = new Error("Email already exist!");
    error.statusCode = 409;
    throw error;
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email }
  });

  if (existingEmail) {
    const error:any = new Error("Email already exist!");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const defaultRole = 3;

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      password: hashedPassword,
      role_id: defaultRole,
    },
    include: { role: true }
  })

  if (user.role?.name.toLowerCase() === "customer") {
    await prisma.customer.create({
      data: {
        user_id: user.id,
        points: 0,
      }
    });
  }

  return {
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name,
    }
  }
}