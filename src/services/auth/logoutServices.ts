import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.config";
import { appConfig } from "../../config/app.config";

export const logoutService = async (token: string) => {
  try {
    const existingToken = await prisma.blacklistToken.findFirst({
      where: { token }
    });
    if (existingToken) {
      const error: any = new Error("Token already blacklisted");
      error.statusCode = 409;
      throw error;
    }

    const decoded = jwt.verify(token, appConfig.JWTSECRET as jwt.Secret) as any;

    await prisma.blacklistToken.create({
      data: {
        token,
        expired_at: new Date(decoded.exp * 1000),
      },
    });
  } catch (error: any) {
    console.error("LogoutService Error:", error.message);
    const err: any = new Error("Invalid or expired token");
    err.statusCode = 401;
    throw err;
  }
}