import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";
import { Request } from "express";

export const uploadFile = (folder: string) => {
  const uploadPath = path.join(process.cwd(), "uploads", folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext)
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]/g, "");

      callback(null, `${Date.now()}-${name}${ext}`);
    },
  });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      return callback(new Error("Only JPG/PNG allowed"));
    }
    callback(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 },
  });
};

export const uploadImgProduct = [
  uploadFile("product").single("image")
];

export const uploadAvatar = [
  uploadFile("profile").single("avatar")
];