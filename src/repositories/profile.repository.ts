import prisma from "../config/prisma.config";
import { ProfileUpdateRequest } from "../types/profile";

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

  static async update(userId: number, payload: ProfileUpdateRequest) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          avatar: payload.avatar ?? null,
          name: payload.name,
          username: payload.username,
          email: payload.email,
          phoneNumber: payload.phoneNumber ?? null,
          birthDate: payload.birthDate ? new Date(payload.birthDate) : null 
        }
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}