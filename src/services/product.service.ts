import prisma from "../config/prisma.config";
import { CategoryRepository } from "../repositories/category.repository";
import { ProductRepository } from "../repositories/product.repository";
import { Product, ProductCreateRequest, ProductUpdateRequest } from "../types/product";
import { ErrorHandler } from "../utils/error.utils";

export class ProductService{
  static async create(payload: ProductCreateRequest) {
    try {
      const productData: Product = {
        categoryId: Number(payload.categoryId),
        name: payload.name,
        description: payload.description,
        price: payload.price,
        stock: Number(payload.stock),
        image: payload.image
      };

      if (productData.name.trim() === "") {
        throw new ErrorHandler(404, "Product name cannot be empty");
      };

      const categoryExist = await CategoryRepository.findCategoryById(productData.categoryId);
      if (!categoryExist) {
        throw new ErrorHandler(404, "Category not found");
      };

      const existingProduct = await ProductRepository.findProductByName(productData.name);
      if (existingProduct) {
        throw new ErrorHandler(409, "Product already exist");
      };

      const product = await ProductRepository.create(productData);
      return product;
    } catch (error) {
      throw error;
    };
  };

  static async getProducts() {
    try {
      const products = await ProductRepository.findProducts();
      return products;
    } catch (error) {
      throw error;
    };
  };

  static async getProductById(productId: number) {
    try {
      const product = await ProductRepository.findProductById(productId);
      if (!product) {
        throw new ErrorHandler(404, "Product not found")
      };
      
      return product;
    } catch (error) {
      throw error;
    };
  };

  static async update(productId: number, payload: ProductUpdateRequest) {
    try {
      const productData: Product = {
        categoryId: Number(payload.categoryId),
        name: payload.name,
        description: payload.description,
        stock: Number(payload.stock),
        price: payload.price,
        image: payload.image
      };

      const findProduct = await ProductRepository.findProductById(productId);
      if (!findProduct) {
        throw new ErrorHandler(404, "Product not found");
      };

      if (!productData.categoryId) {
        throw new ErrorHandler(400, "CategoryId cannot be empty")
      };

      if (productData.name && productData.name.trim() !== "") {
        const existingProduct = await ProductRepository.findDuplicateProduct(productId, productData.name);
        if (existingProduct) {
          throw new ErrorHandler(409, "Product already exist");
        };
      };

      const product = await ProductRepository.update(productId, productData);
      return product;
    } catch (error) {
      throw error;
    };
  };

  static async delete(productId: number) {
    try {
      const findProduct = await ProductRepository.findProductById(productId);
      if (!findProduct) {
        throw new ErrorHandler(404, "Product not found")
      };
      
      const product = await ProductRepository.delete(productId);
      return product;
    } catch (error) {
      throw error;
    };
  };
}