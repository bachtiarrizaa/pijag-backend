import prisma from "../../config/prisma.config";
import { CreateProduct, UpdateProduct } from "../../types/prodiuct/product";

export const createProductServices = async (data: CreateProduct) => {
  const {
    category_id,
    name,
    description,
    price,
    stock,
    image
  } = data;

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

  const categoryExist = await prisma.category.findUnique({
    where: { id: Number(category_id) }
  });

  if (!categoryExist) {
    const error: any = new Error("Category not found");
    error.statusCode = 404;
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
      category_id: Number(category_id),
      name,
      description,
      price,
      stock: Number(stock),
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
  const normalizedInput = categoryName.replace(/\s+/g, "").toLocaleLowerCase();

  const categories = await prisma.category.findMany();

  const matchedCategory = categories.find((c) => {
    const normalizedDBName = c.name.replace(/\s+/g, "").toLocaleLowerCase();
    return normalizedDBName === normalizedInput;
  });

  if (!matchedCategory) {
    const error: any = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const products = await prisma.product.findMany({
    where: {
      category_id: matchedCategory.id
    }
  })

  return products;
}

export const updatedProductServices = async(productId: number, data: UpdateProduct ) => {
  const { category_id, name, description, price, stock, image } = data;

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    const error: any = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (name && name.trim() !== "") {
    const existing  = await prisma.product.findFirst({
      where: {
        name,
        NOT: { id: productId }
      }
    });
    if (existing) {
      const error: any = new Error("Product already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  const updatedData: any = {};

  if (category_id !== undefined) {
    updatedData.category_id = Number(category_id);
  }
  if (name !== undefined && name.trim() !== "") {
    updatedData.name = name;
  }
  if (description !== undefined) {
    updatedData.description = description;
  }
  if (price !== undefined) {
    updatedData.price = Number(price);
  }
  if (stock !== undefined) {
    updatedData.stock = Number(stock);
  }
  if (image !== undefined) {
    updatedData.image = image;
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: updatedData,
  });

  return updatedProduct;
}

export const deleteProductServices = async(productId: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    const error: any = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const deleteProduct = await prisma.product.delete({
    where: { id: productId }
  });

  return deleteProduct;
}