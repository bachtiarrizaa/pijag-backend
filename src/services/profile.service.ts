import { ProfileRepository } from "../repositories/profile.repository";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../types/user";
import { ErrorHandler } from "../utils/error.utils";

export class ProfileService {
  static async getProfile(userId: number) {
    try {
      const user = await ProfileRepository.findProfileUser(userId);
      if (!user) {
        throw new ErrorHandler(404, "User not found");
      };

      return {
        ...user,
        birthDate: user.birthDate
          ? user.birthDate.toISOString().split("T")[0]
          : null,
      };
    } catch (error) {
      throw error;
    };
  };

  static async update(userId: number, payload: User) {
    try {
      const findUser = await UserRepository.findUserById(userId);
      if (!findUser) {
        throw new ErrorHandler(404, "User not found");
      };

      const profileData: User = {
        avatar: payload.avatar,
        name: payload.name,
        username: payload.username,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        birthDate: payload.birthDate
      };

      if (profileData.email) {
        const existingEmail = await UserRepository.findUserByEmail(profileData.email, userId);
        if (existingEmail) {
          throw new ErrorHandler(409, "Email already exist");
        };
      };

      if (profileData.username) {
        const existingUsername = await UserRepository.findUserByUsername(profileData.username, userId);
        if (existingUsername) {
          throw new ErrorHandler(409, "Username already exist");
        };
      };

      const user = await ProfileRepository.update(userId, profileData);
      return {
        ...user,
        birthDate: user.birthDate
          ? user.birthDate.toISOString().split("T")[0]
          : null,
      };
    } catch (error) {
      throw error;
    }
  }
}