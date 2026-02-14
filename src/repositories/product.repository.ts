import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../config/prisma.config";
import { ProductCreateRequest, ProductUpdateRequest } from "../types/product";
import { ErrorHandler } from "../utils/error.utils";

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

  static async decrementStock(
    productId: number, quantity: number,
    tx: Prisma.TransactionClient
  ) {
    try {
      const stock = await tx.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: quantity
          }
        }
      });

      return stock;
    } catch (error) {
      throw error;
    };
  };

  static async incrementStock(
    productId: number, quantity: number,
    tx: Prisma.TransactionClient
  ) {
    try {
      const stock = await tx.product.update({
        where: { id: productId },
        data: {
          stock: {
            increment: quantity
          }
        }
      });
      return stock;
    } catch (error) {
      throw error;
    };
  };

  static async checkStock(
    productId: number, quantity: number,
    tx: Prisma.TransactionClient) {
    try {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { stock: true }
      });

      if (!product) {
        throw new ErrorHandler(404, `Product ${productId} not found`);
      }

      if (product.stock < quantity) {
        throw new ErrorHandler(400, `Stock not enough for product ${productId}`);
      }

      return product;
    } catch (error) {
      throw error;
    };
  };

  private static get activeDiscount() {
    const now = new Date();

    return {
      discounts: {
        where: {
          isActive: true,
          discount: {
            isActive: true,
            AND: [
              { OR: [{ startDate: null }, { startDate: { lte: now } }] },
              { OR: [{ endDate: null }, { endDate: { gte: now } }] }
            ]
          }
        },
        include: {
          discount: true
        },
        take: 1
      }
    }
  }

  static async findProductById(productId: number) {
    try {
      const product = await prisma.product.findFirst({
        where: { id: productId },
        include: {
          category: true,
          ...this.activeDiscount
        }
      });
      return product;
    } catch (error) {
      throw error;
    }
  }

  static async findProductByIds(productIds: number[]) {
    try {
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: {
          ...this.activeDiscount,
          category: true
        }
      });
      return products;
    } catch (error) {
      throw error;
    };
  };

  static async findProducts(skip: number, take: number) {
    try {
      const products = await prisma.product.findMany({
        skip,
        take,
        orderBy: {
          createdAt: "desc"
        },
        include: {
          ...this.activeDiscount,
          category: true,
        },
      });
      return products;
    } catch (error) {
      throw error;
    };
  };

  static async count() {
    const countProducts = await prisma.product.count();
    return countProducts;
  }

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