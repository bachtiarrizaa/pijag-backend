import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/error.utils";
import prisma from "../config/prisma.config";
import { verifyAccessToken } from "../utils/jwt.util";

export class AuthMiddleware {
  static authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        throw new ErrorHandler(401, "Unauthorized: No token provided");
      };
      
      const token = authHeader.split(" ")[1];
      if (!token) {
        throw new ErrorHandler(401, "Unauthorized: Token missing");
      };

      const isBlacklisted = await prisma.blacklistToken.findFirst({
        where: { token }
      });
      if (isBlacklisted) {
        throw new ErrorHandler(401, "Token has been revoked");
      };

      const decoded = verifyAccessToken(token);
      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };

  static authorizeRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const user = req.user;
        console.log("User dari request:", user);

        if (!user) {
          throw new ErrorHandler(403, "Forbidden: No user data")
        }

        const userRole = user.roleName.toLowerCase();
        if(!allowedRoles.includes(userRole)) {
          throw new ErrorHandler(403, "Forbidden: Access denied")
        }

        next();
      } catch (error) {
        // throw new ErrorHandler(403, "Unauthorized role");
        next(error);
      }
    };
  };

  static isAdmin = [
    AuthMiddleware.authenticateToken, 
    AuthMiddleware.authorizeRole(["admin"])
  ];

  static isCashier = [
    AuthMiddleware.authenticateToken, 
    AuthMiddleware.authorizeRole(["cashier"])
  ];

  static isCustomer = [
    AuthMiddleware.authenticateToken, 
    AuthMiddleware.authorizeRole(["customer"])
  ];
}