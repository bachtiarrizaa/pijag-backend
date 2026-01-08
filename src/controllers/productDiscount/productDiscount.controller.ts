// import { Request, Response } from "express";
// import { createProductDiscountService } from "../../services/productDiscount/productDiscount.service";

// export const createProductDiscountController = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const productId = Number(req.params.productId);
//     const { discount_id } = req.body;

//     const result = await createProductDiscountService(productId, discount_id);

//     res.status(201).json({
//       success: true,
//       message: "Discount assigned to product",
//       data: result
//     });
//   } catch (error: any) {
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
