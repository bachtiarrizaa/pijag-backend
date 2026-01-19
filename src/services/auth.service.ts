import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { LoginRequest, RegisterRequest } from "../types/auth";
import { ErrorHandler } from "../utils/error.utils";
import { CustomerRepository } from "../repositories/customer.repository";
import { generateAccessToken, verifyAccessToken } from "../utils/jwt.util";
import { BlacklistTokenRepository } from "../repositories/blacklist-token.repository";

export class AuthService {
  static async register (payload: RegisterRequest) {
    try {
      const { username, email, password } = payload;
      
      const existingUsername = await UserRepository.findUsername(username);
      if (existingUsername) {
        throw new ErrorHandler(400, "Username already exist");
      }

      const existingEmail = await UserRepository.findEmail(email);
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

  static async login (payload: LoginRequest) {
    try {
      const { email, password } = payload;

      const user = await UserRepository.findUser(email)
      if (!user) {
        throw new ErrorHandler(404, "User not found");
      };

      if (!user.roleId || !user.role?.name) {
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
        roleId: user.roleId,
        roleName: user.role?.name
      });

      return {
        // user,
        accessToken
      };
    }  catch (error) {
      throw error;
    };
  };

  static async logout (token: string) {
    try {
      const isBlacklisted = await BlacklistTokenRepository.findBlacklistToken(token);
      if (isBlacklisted) {
        throw new ErrorHandler(401, "Token has been revoked");
      };

      let decoded;
      try {
        decoded = verifyAccessToken(token);
      } catch {
        throw new ErrorHandler(401, "Invalid or expired token")
      };

      await BlacklistTokenRepository.create(
        token,
        new Date(decoded.exp! * 1000)
      );
    } catch (error: any) {
      throw error;
    };
  }
}