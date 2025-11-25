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

export const getAllProductServices = async() => {
  const getAllProduct = await prisma.product.findMany({
    orderBy: {
      created_at: "desc"
    }
  });

  return getAllProduct;
}

export const getProductByIdServices = async(productId: number) => {
  const getProductById = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!getProductById) {
    const error: any = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }
  return getProductById;
}

export const getProductByCategoryServices = async(categoryName: string) => {
  const normalizedInput = categoryName.replace(/\=/g, "").toLocaleLowerCase();

  const categories = await prisma.category.findMany();

  const macthedCategory = categories.find((c) => {
    const normalizedDBName = c.name.replace(/\s+/g, "").toLocaleLowerCase();
    return normalizedDBName === normalizedInput;
  });

  if (!macthedCategory) {
    const error: any = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const products = await prisma.product.findMany({
    where: {
      category_id: macthedCategory.id
    }
  })

  return products;
}

export const deleteProductServices = async(productId: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    const error: any = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const deleteProduct = await prisma.product.delete({
    where: { id: productId }
  });

  return deleteProduct;
}