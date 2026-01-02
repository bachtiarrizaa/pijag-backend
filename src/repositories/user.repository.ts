import prisma from "../config/prisma.config";
import { Register } from "../types/auth/auth";

export class UserRepository{
  static async create (payload: Register, hashedPassword: string) {
    try {
      const user = await prisma.user.create({
        data: {
          name: payload.name,
          username: payload.username,
          email: payload.email,
          password: hashedPassword,
          role_id: 2
        },
        include: {
          role: true
        }
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}