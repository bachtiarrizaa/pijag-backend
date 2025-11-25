import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.config";
import { appConfig } from "../config/app.config";
import { JwtPayload } from "jsonwebtoken";
import { sendError } from "../utils/respon.handler";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return sendError(res, 401, "Unauthorized: No token provided");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return sendError(res, 401, "Unauthorized: Token missing");
    }

    const isBlacklisted = await prisma.blacklistToken.findFirst({ where: { token } });
    if (isBlacklisted) {
      return sendError(res, 401, "Token has been revoked");
    }

    const decoded = jwt.verify(token, appConfig.JWTSECRET as jwt.Secret) as JwtPayload;
    req.user = decoded;

    next();
  } catch (error: any) {
    console.error("AuthMiddleware Error:", error.message);

    if (error instanceof jwt.TokenExpiredError) {
      return sendError(res, 401, "Token expired, please login again");
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return sendError(res, 403, "Invalid token");
    }

    return sendError(res, 500, "Authentication failed");
  }
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = req.user;

      if (!user) return sendError(res, 403, "Forbidden: No user data");

      const userRole = user.role_name.toLowerCase();
      if(!allowedRoles.includes(userRole)) {
        return sendError(res, 403, "Forbidden: Access denied");
      }

      next();
    } catch (error: any) {
      console.error("RoleMiddleware Error:", error.message);
      return sendError(res, 403, "Unauthorized role");
    }
  };
};

export const isAdmin = [authenticateToken, authorizeRole(["admin"])];

export const isCustomer = [authenticateToken, authorizeRole(["customer"])];
export const isCashier = [authenticateToken, authorizeRole(["cashier"])];