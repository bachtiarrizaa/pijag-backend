import prisma from "../config/prisma.config";
import { CategoryCreateRequest, CategoryUpdateRequest } from "../types/category";

export class CategoryRepository {
  static async findCategoryByName(name: string) {
    try {
      const category = await prisma.category.findFirst({
        where: { name }
      });
      return category;
    } catch (error) {
      throw error;
    }
  }
  
  static async create(payload: CategoryCreateRequest) {
    try {
      const category = await prisma.category.create({
        data: {
          name: payload.name
        },
      });
      return category;
    } catch (error) {
      throw error;
    };
  };

  static async findCategories() {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          created_at: "desc"
        },
      });
      return categories;
    } catch (error) {
      throw error;
    };
  };

  static async findCategoryById(categoryId: number) {
    try {
      const category = await prisma.category.findFirst({
        where: { id: categoryId }
      });
      return category;
    } catch (error) {
      throw error;
    };
  };

  static async update(categoryId: number, payload: CategoryUpdateRequest) {
    try {
      const category = await prisma.category.update({
        where: { id: categoryId },
        data: {
          name: payload.name
        },
      });
      return category;
    } catch (error) {
      throw error;
    };
  };

  static async delete(categoryId: number) {
    try {
      const category = await prisma.category.delete({
        where: { id: categoryId }
      });
      return category;
    } catch (error) {
      throw error;
    };
  };
}