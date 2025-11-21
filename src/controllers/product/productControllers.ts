import { Request, Response  } from "express";
import { sendSuccess, sendError } from "../../utils/respon.handler";
import { createProductServices } from "../../services/product/productServices";

export const createProductControllers = async (req: Request, res: Response) => {
  try {
    const reqBody = req.body;

    if (req.file) {
      reqBody.image = req.file.filename
    }

    const createProduct = await createProductServices(reqBody);
    return sendSuccess(
      res, 201, "Product created successfully",
      createProduct
    );
  } catch (error: any) {
    console.error("ProductCreate Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}