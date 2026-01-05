import prisma from "../config/prisma.config";
import { ProductCreateRequest, ProductUpdateRequest } from "../types/product";

export class ProductRepository {
  static async findProductByName(name: string) {
    try {
      const product = await prisma.product.findFirst({
        where: { name }
      });
      return product;
    } catch (error) {
      throw error;
    };
  };

  static async findDuplicateProduct(productId: number, name: string){
    try {
      const product = await prisma.role.findFirst({
        where: {
          name,
          NOT: { id: productId }
        },
      });
      return product;
    } catch (error) {
      throw error;
    }
  }

  static async create(payload: ProductCreateRequest) {
    try {
      const product = await prisma.product.create({
        data: {
          categoryId: payload.categoryId,
          name: payload.name,
          description: payload.description,
          price: payload.price,
          stock: payload.stock,
          image: payload.image
        }
      });
      return product;
    } catch (error) {
      throw error
    };
  };

  static async findProductById(productId: number) {
    try {
      const product = await prisma.product.findFirst({
        where: { id: productId }
      });
      return product;
    } catch (error) {
      throw error;
    }
  }

  static async findProducts() {
    try {
      const products = await prisma.product.findMany({
        orderBy: {
          createdAt: "desc"
        },
      });
      return products;
    } catch (error) {
      throw error;
    };
  };

  static async update(productId: number, payload: ProductUpdateRequest) {
    try {
      const product = await prisma.product.update({
        where: { id: productId },
        data: {
          categoryId: payload.categoryId,
          name: payload.name,
          description: payload.description,
          price: payload.price,
          stock: payload.stock,
          image: payload.image
        },
      });
      return product;
    } catch (error) {
      throw error;
    };
  };

  static async delete(productId: number) {
    try {
      const product = await prisma.product.delete({
        where: { id: productId }
      });
      return product
    } catch (error) {
      throw error;
    };
  };
}