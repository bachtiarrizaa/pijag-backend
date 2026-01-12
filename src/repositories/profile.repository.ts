import prisma from "../config/prisma.config";
import { User } from "../types/user";

export class ProfileRepository {
  static async findProfileUser(userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true }
      });
      return user;
    } catch (error) {
      throw error;
    };
  };

  static async update(userId: number, payload: User) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          avatar: payload.avatar,
          name: payload.name,
          username: payload.username,
          email: payload.email,
          phoneNumber: payload.phoneNumber,
          birthDate: payload.birthDate ? new Date(payload.birthDate) : null 
        }
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}