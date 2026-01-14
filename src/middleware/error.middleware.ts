import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/error.utils";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Jika error berasal dari ErrorHandler kustom kita
  if (err instanceof ErrorHandler) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Jika error tidak dikenal (Internal Server Error)
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : {}
  });
};