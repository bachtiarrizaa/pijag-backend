import prisma from "../config/prisma.config";
import { ProductCreateRequest, ProductUpdateRequest } from "../types/product";
import { DiscountUtils } from "../utils/discount.utils";

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
      const now = new Date();
      const product = await prisma.product.findFirst({
        where: { id: productId },
        include: this.activeDiscount
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
        include: this.activeDiscount
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