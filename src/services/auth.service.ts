import prisma from "../config/prisma.config";
import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { Login, Register } from "../types/auth/auth";
import { ErrorHandler } from "../utils/error.utils";
import { CustomerRepository } from "../repositories/customer.repository";
import { generateAccessToken, verifyAccessToken } from "../utils/jwt.util";

export class AuthService {
  async register (payload: Register) {
    try {
      const { username, email, password } = payload;
      
      const existingUsername = await prisma.user.findUnique({
        where: { username }
      });
      if (existingUsername) {
        throw new ErrorHandler(400, "Username already exist");
      }

      const existingEmail = await prisma.user.findUnique({
        where: { email }
      });
      if (existingEmail) {
        throw new ErrorHandler(400, "Email already exist");
      };

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserRepository.create(payload, hashedPassword);
      
      if (user.role?.name.toLocaleLowerCase() === "customer") {
        await CustomerRepository.create(user.id);
      };

      // return user;
    } catch (error) {
      throw error;
    };
  };

  async login (payload: Login) {
    try {
      const { email, password } = payload;

      const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
      });
      if (!user) {
        throw new ErrorHandler(404, "User not found");
      };

      if (!user.role_id || !user.role?.name) {
        throw new ErrorHandler(404, "User role is not properly assigned");
      };


      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ErrorHandler(401, "invalid password");
      };

      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role_id: user.role_id,
        role_name: user.role?.name
      });

      return {
        // user,
        accessToken
      };
    }  catch (error) {
      throw error;
    };
  };

  async logout (token: string) {
    try {
      const existingToken = await prisma.blacklistToken.findFirst({
        where: { token }
      });
      if (existingToken) {
        throw new ErrorHandler(409, "Token already blacklisted");
      };

      let decoded;
      try {
        decoded = verifyAccessToken(token);
      } catch {
        throw new ErrorHandler(409, "Invalid or expired token")
      };

      await prisma.blacklistToken.create({
        data: {
          token,
          expired_at: new Date(decoded.exp! * 1000),
        },
      });
    } catch (error: any) {
      throw error;
    };
  }
}