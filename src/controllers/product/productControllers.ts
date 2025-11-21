import { Request, Response  } from "express";
import { sendSuccess, sendError } from "../../utils/respon.handler";
import { createProductServices, getAllProductServices, getProductByCategoryServices, getProductByIdServices } from "../../services/product/productServices";

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

export const getAllProductControllers = async(req: Request, res: Response) => {
  try {
    const allProducts = await getAllProductServices();
    return sendSuccess(
      res, 200, "All product fetched successfully",
      allProducts
    );
  } catch (error: any) {
    console.error("GetAllProducts Erro: ", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const getProductByIdControllers = async(req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if(!id) {
      return sendError(res, 400, "Product Id is required");
    }
    const productId = parseInt(id, 10);

    const getProductById = await getProductByIdServices(productId);
    return sendSuccess(
      res, 200, "Product fetched successfully",
      getProductById
    );
  } catch (error: any) {
    console.error("GetProductById Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const getProductByCategoryControllers = async(req: Request, res: Response) => {
  try {
    const { name }= req.query;
    if (typeof name !== "string") {
      return sendError(res, 400, "Query param 'name' is required");
    }
    const products = await getProductByCategoryServices(name);
     return sendSuccess(res, 200, "Products fetched successfully", products);
  } catch (error: any) {
    console.error("GetProductById Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}