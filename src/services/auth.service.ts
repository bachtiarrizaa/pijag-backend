import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { Login, LoginRequest, Register } from "../types/auth";
import { ErrorHandler } from "../utils/error.utils";
import { CustomerRepository } from "../repositories/customer.repository";
import { generateAccessToken, verifyAccessToken } from "../utils/jwt.util";
import { BlacklistTokenRepository } from "../repositories/blacklist-token.repository";
import { UserCreateRequest } from "../types/user";

export class AuthService {
  static async register (payload: UserCreateRequest) {
    try {
      const hashedPassword = await bcrypt.hash(payload.password, 10);

      const registerData: Register = {
        name: payload.name,
        username: payload.username,
        email: payload.email,
        password: hashedPassword,
        roleId: payload.roleId
      }
      
      const existingUsername = await UserRepository.findUsername(registerData.username);
      if (existingUsername) {
        throw new ErrorHandler(400, "Username already exist");
      }

      const existingEmail = await UserRepository.findEmail(registerData.email);
      if (existingEmail) {
        throw new ErrorHandler(400, "Email already exist");
      };

      const user = await UserRepository.create(registerData, hashedPassword);
      
      if (user.role?.name.toLocaleLowerCase() === "customer") {
        await CustomerRepository.create(user.role?.id);
      };

      return user;
    } catch (error) {
      throw error;
    };
  };

  static async login (payload: LoginRequest) {
    try {
      const loginData: Login = {
        email: payload.email,
        password: payload.password
      }

      const user = await UserRepository.findUser(loginData.email)
      if (!user) {
        throw new ErrorHandler(404, "User not found");
      };

      if (!user.roleId || !user.role?.name) {
        throw new ErrorHandler(404, "User role is not properly assigned");
      };

      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
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
        ...user,
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