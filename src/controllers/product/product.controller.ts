import { NextFunction, Request, Response  } from "express";
import { sendSuccess, sendError } from "../../utils/respon.handler";
import {
  createProductService,
  deleteProductService,
  // getAllProductService,
  // getProductByCategoryService,
  getProductByIdService,
  getProductsService,
  updatedProductService
} from "../../services/product/product.service";
import { UpdateProduct } from "../../types/prodiuct/product";

export const createProductController = async (req: Request, res: Response) => {
  try {
    const reqBody = req.body;

    if (req.file) {
      reqBody.image = req.file.filename
    }

    const createProduct = await createProductService(reqBody);
    return sendSuccess(
      res, 201, "Product created successfully",
      createProduct
    );
  } catch (error: any) {
    console.error("ProductCreate Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const getProductsController = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const products = await getProductsService(
      category ? String(category) : undefined
    );

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error: any) {
    console.error("GetProductById Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const getProductByIdController = async(req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if(!id) {
      return sendError(res, 400, "Product Id is required");
    }
    const productId = parseInt(id, 10);

    const getProductById = await getProductByIdService(productId);
    return sendSuccess(
      res, 200, "Product fetched successfully",
      getProductById
    );
  } catch (error: any) {
    console.error("GetProductById Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const updatedProductController = async(req: Request, res: Response) => {
  try {

    const { id } = req.params;

    if (!id) {
      return sendError(
        res, 400, "Product Id is required"
      )
    }

    const productId = parseInt(id, 10)

    const reqBody: UpdateProduct = req.body;

    if (req.file) {
      reqBody.image = req.file.filename;
    }

    const updatedProduct = await updatedProductService(productId, reqBody);
    return sendSuccess(res, 200, "Product updated successfully", updatedProduct);
  } catch (error: any) {
    console.error("UpdatedProduct Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const deleteProductController = async(req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(
        res, 400, "Product Id is required"
      );
    }

    const productId = parseInt(id, 10);
    await deleteProductService(productId)
    return sendSuccess(
      res, 200, "Product deleted successfully"
    );
  } catch (error: any) {
    console.error("DeleteProduct Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}