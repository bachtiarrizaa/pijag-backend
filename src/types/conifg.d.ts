// import type { SignOptions } from "jsonwebtoken";

export interface AppConfig {
    PORT: number;
    ENV: string;
    JWTSECRET: string;
    JWTEXPIRES: string;
}