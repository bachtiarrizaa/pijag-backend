import { Request, Response } from "express";
import { sendSuccess, sendError } from "../../utils/respon.handler";
import { createCategoryServices, deleteCategoryServices, getAllCategoriesServices, getCategoryByIdServices, updateCategoryServices } from "../../services/category/categoryServices";

export const createCategoryControllers = async (req: Request, res: Response) => {
  try {
    const name = req.body;
    const createCategory = await createCategoryServices(name);
    return sendSuccess(
      res, 201, "Category created successfully",
      createCategory
    );
  } catch (error: any) {
    console.error("CreateCategory Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const getAllCategoriesControllers = async (req: Request, res: Response) => {
  try {
    const allCategories = await getAllCategoriesServices();
    return sendSuccess(res, 200, "All categories fetched successfully", allCategories);
  } catch (error:any) {
    console.error("GetAllCategories error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const getCategoryByIdControllers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(
        res, 400, "Category Id is required"
      );
    }

    const categoryId = parseInt(id, 10);

    const getCategoryById = await getCategoryByIdServices(categoryId)
    return sendSuccess(res, 200, "Category fetched successfully", getCategoryById);
  } catch (error: any) {
    console.error("GetCategoryByIdController Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const updatedCategoryControllers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reqBody  = req.body;

    if (!id) {
      return sendError(
        res, 201, "Category id is required"
      );
    }

    const categoryId = parseInt(id, 10);
    const updatedCategory = await updateCategoryServices(categoryId, reqBody);
    return sendSuccess(res, 200, "Category updated successfully", updatedCategory);
  } catch (error: any) {
    console.error("UpdateCategory Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const deleteCategoryController = async(req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendError(
        res, 400, "Category Id is required"
      );
    }
    const categoryId = parseInt(id, 10)
    await deleteCategoryServices(categoryId);
    return sendSuccess(
      res, 200, "Category deleted successfully"
    );
  } catch (error: any) {
    console.error("DeleteCategory Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}