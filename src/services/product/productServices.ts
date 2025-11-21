import prisma from "../../config/prisma.config";
import { CreateProduct } from "../../types/prodiuct/product";

export const createProductServices = async (data: CreateProduct) => {
  const {
    category_id,
    name,
    description,
    price,
    stock,
    image
  } = data;

  const parsedCategoryId = Number(category_id);
  // const parsedPrice = Number(price);
  const parsedStock = Number(stock);

  if ( category_id == null || !name || !description || price == null || stock == null || !image ) {
    const error: any = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  if (name.trim() === "") {
    const error: any = new Error("Name cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  const existingProduct = await prisma.product.findFirst({
    where: { name }
  });

  if (existingProduct) {
    const error: any = new Error("Product name already exists");
    error.statusCode = 409;
    throw error;
  }

  const createProduct = await prisma.product.create({
    data: {
      category_id: parsedCategoryId,
      name,
      description,
      price,
      stock: parsedStock,
      image,
    },
    include: {
      category: true
    }
  });

  return createProduct;
};
