import prisma from "../../config/prisma.config";

export const createProductDiscountService = async (productId: number, discountId: number) => {
  const product = await prisma.product.findUnique({
    where:{ id: productId }
  });

  if (!product) {
    const error: any = new Error("Product not found!");
    error.statusCode = 404;
    throw error;
  }

  const now = new Date();

  const discount = await prisma.discount.findFirst({
    where: {
      id: discountId,
      is_active: true,
      AND: [
        {
          OR: [
            { start_date: null },
            { start_date: { lte: now } },
          ]
        },
        {
          OR: [
            { end_date: null },
            { end_date: { gte: now } },
          ]
        }
      ]
    }
  });


  if (!discount) {
    const error: any = new Error("Discount not active or expired");
    error.statusCode = 400;
    throw error;
  }

  await prisma.productDiscount.deleteMany({
    where: { product_id: productId },
  })

  const productDiscount = await prisma.productDiscount.create({
    data: {
      product_id: productId,
      discount_id: discountId
    }
  });

  return productDiscount
}