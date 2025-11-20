import { Response } from "express";

export const sendSuccess = (res: Response, statusCode: number, message: string, data?: any): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data: data || null,  
  });
};

export const sendError = (res: Response, statusCode: number, message: string, data?: any): void => {
  res.status(statusCode).json({
    success: false,
    message,  
  });
};