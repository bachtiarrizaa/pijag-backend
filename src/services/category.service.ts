import { CategoryRepository } from "../repositories/category.repository";
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from "../types/category";
import { PaginationQuery } from "../types/pagination";
import { ErrorHandler } from "../utils/error.utils";
import { PaginateUtils } from "../utils/pagination.utils";

export class CategoryService {
  static async create(payload: CategoryCreateRequest) {
    try {
      const categoryData: Category = {
        name: payload.name
      };

      const existingCategory = await CategoryRepository.findCategoryByName(categoryData.name);
      if (existingCategory) {
        throw new ErrorHandler(409, "Category already exist");
      };

      if (!categoryData.name || categoryData.name.trim() === "") {
        throw new ErrorHandler(400, "Category name cannot be empty");
      };

      const category = await CategoryRepository.create(categoryData);
      return category;
    } catch (error) {
      throw error;
    };
  };

  static async getCategories(query: PaginationQuery) {
    try {
      const { page, limit, offset } = PaginateUtils.paginate(query);
      const categories = await CategoryRepository.findCategories(offset, limit);
      const totalItems = await CategoryRepository.count();
      const meta = PaginateUtils.buildMeta({
        totalItems,
        currentPage: page,
        itemsPerPage: limit,
        itemCount: categories.length
      });
      return { categories, meta };
    } catch (error) {
      throw error;
    };
  };

  static async update(categoryId: number, payload: CategoryUpdateRequest) {
    try {
      const categoryData: Category = {
        name: payload.name
      };

      const findCategory = await CategoryRepository.findCategoryById(categoryId);
      if (!findCategory) {
        throw new ErrorHandler(404, "Category not found");
      };

      const existingCategory = await CategoryRepository.findCategoryByName(categoryData.name);
      if (existingCategory) {
        throw new ErrorHandler(409, "Category already exist");
      };

      if (!categoryData.name || categoryData.name.trim() === "") {
        throw new ErrorHandler(400, "Category name cannot be empty");
      };

      const category = await CategoryRepository.update(categoryId, categoryData);
      return category;
    } catch (error) {
      throw error;
    };
  };

  static async delete(categoryId: number) {
    try {
      const findCategory = await CategoryRepository.findCategoryById(categoryId);
      if (!findCategory) {
        throw new ErrorHandler(404, "Category not found");
      };

      const category = await CategoryRepository.delete(categoryId);
      return category;
    } catch (error) {
      throw error;
    }
  }
}