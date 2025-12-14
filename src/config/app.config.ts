import { AppConfig } from "../types/conifg";

export const appConfig: AppConfig = {
  APP_PORT: parseInt(process.env.APP_PORT || "3000", 10),
  APP_ENV: process.env.APP_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
};

