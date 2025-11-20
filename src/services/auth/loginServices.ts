import { appConfig } from "../../config/app.config";
import prisma from "../../config/prisma.config";
import { Auth } from "../../types/auth/auth";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

export const loginServices = async (data: Auth) => {
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

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error: any = new Error("Invalid password!");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role_id: user.role_id,
      role_name: user.role?.name,
    },
    appConfig.JWTSECRET,
    { expiresIn: appConfig.JWTEXPIRES } as SignOptions
  )

  return {
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role?.name,
    },
    token,
  };
}