import prisma from "../../config/prisma.config";
import { Login } from "../../types/auth/auth";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../../utils/jwt.util";

export const loginService = async (data: Login) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user) {
    const error: any = new Error("Email not found!");
    error.statusCode = 404;
    throw error;
  }

  if (!user.role_id || !user.role?.name) {
    const error: any = new Error("User role is not properly assigned");
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error: any = new Error("Invalid password!");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    username: user.username,
    role_id: user.role_id,
    role_name: user.role?.name,
  });

  return {
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role?.name,
    },
    accessToken,
  };
}