import { Request, Response } from "express"
import { sendSuccess, sendError } from "../../utils/respon.handler"
import { createDiscountService, deleteDiscountService, getDiscountService, updateDiscountService } from "../../services/discount/discount.service";

export const createDiscountController = async (req: Request, res: Response) => {
  try {
    const reqBody = req.body;

    const createDiscount = await createDiscountService(reqBody);
    return sendSuccess(
      res, 201, "Discount created successfully",
      createDiscount
    )
  } catch (error: any) {
    console.error("CreateDiscount Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const getDiscountController = async (req: Request, res: Response) => {
  try {
    const { type } = req.query; // ambil query param
    const discounts = await getDiscountService(type as "percent" | "fixed");
    res.status(200).json({
      success: true,
      data: discounts
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateDiscountController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reqBody = req.body;

    if (!id) {
      return sendError(
        res, 201, "Discount id is required"
      );
    }

    const discountId = parseInt(id, 10);
    const updateDiscount = await updateDiscountService(discountId, reqBody);
    return sendSuccess(
      res, 200, "Discount updated successfully", updateDiscount
    )
  } catch (error: any) {
    console.error("UpdateCategory Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}

export const deleteDiscountController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendError(
        res, 400, "Product Id is required"
      );
    }

    const discountId = parseInt(id, 10);
    await deleteDiscountService(discountId);
    return sendSuccess(
      res, 200, "Discount deleted successfully"
    )
  } catch (error: any) {
    console.error("DeleteProduct Error:", error.message);
    return sendError(res, error.statusCode || 400, error.message);
  }
}