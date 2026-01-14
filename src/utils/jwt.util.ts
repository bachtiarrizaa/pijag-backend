import jwt, { JwtPayload } from "jsonwebtoken";
import { appConfig } from "../config/app.config";
import { AccessTokenSign } from "../types/auth/auth";

export const generateAccessToken = (payload: AccessTokenSign) => {
  return jwt.sign(payload, appConfig.JWT_SECRET, {
    expiresIn: "1d",
  });
}

export type AccessTokenPayload = AccessTokenSign & JwtPayload;

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, appConfig.JWT_SECRET);

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  return decoded as AccessTokenPayload;
};