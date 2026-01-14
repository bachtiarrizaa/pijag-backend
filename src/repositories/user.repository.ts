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
          roleId: 1
        },
        include: {
          role: true
        }
      });

      return user;
    } catch (error) {
      throw error;
    };
  };

  static async findUserById (userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      return user;
    } catch (error) {
      throw error;
    };
  };

  static async findUserByEmail (email: string, userId: number) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: userId}
        }
      });
      return user;
    } catch (error) {
      throw error;
    };
  };

  static async findUserByUsername(username: string, userId: number) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: userId }
        }
      });
      return user;
    } catch (error) {
      throw error;
    };
  };
}