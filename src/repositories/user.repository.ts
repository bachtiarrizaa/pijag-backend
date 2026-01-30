import prisma from "../config/prisma.config";
import { UserCreateRequest, UserUpdateRequest } from "../types/user";

export class UserRepository{
  static async create (payload: UserCreateRequest, hashedPassword: string) {
    try {
      const user = await prisma.user.create({
        data: {
          name: payload.name,
          username: payload.username,
          email: payload.email,
          password: hashedPassword,
          roleId: 3
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

  static async findUsername(username: string) {
    try {
      const existingUsername = await prisma.user.findUnique({
        where: { username }
      });
      return existingUsername;
    } catch (error) {
      throw error;
    };
  };

  static async findEmail(email: string) {
    try {
      const existingEmail = await prisma.user.findUnique({
        where: { email }
      });

      return existingEmail;
    } catch (error) {
      throw error;
    };
  };

  static async findUser(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true }
      });
      return user;
    } catch (error) {
      throw error;
    };
  };
}