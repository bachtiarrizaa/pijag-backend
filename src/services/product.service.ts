import { Decimal } from "@prisma/client/runtime/library";
import { CategoryRepository } from "../repositories/category.repository";
import { ProductRepository } from "../repositories/product.repository";
import { Product, ProductCreateRequest, ProductUpdateRequest } from "../types/product";
import { DiscountUtils } from "../utils/discount.utils";
import { ErrorHandler } from "../utils/error.utils";
import { PaginationQuery } from "../types/pagination";
import { PaginateUtils } from "../utils/pagination.utils";

export class ProductService{
  static async create(payload: ProductCreateRequest) {
    try {
      const productData: Product = {
        categoryId: Number(payload.categoryId),
        name: payload.name,
        description: payload.description,
        price: new Decimal(payload.price),
        stock: Number(payload.stock),
        image: payload.image
      };

      if (productData.name.trim() === "") {
        throw new ErrorHandler(400, "Product name cannot be empty");
      };

      const categoryExist = await CategoryRepository.findCategoryById(productData.categoryId);
      if (!categoryExist) {
        throw new ErrorHandler(404, "Category not found");
      };

      const existingProduct = await ProductRepository.findProductByName(productData.name);
      if (existingProduct) {
        throw new ErrorHandler(409, "Product already exist");
      };

      if (!productData.image) {
        throw new ErrorHandler(400, "Image cannot be empty");
      };

      if (productData.stock < 0) {
        throw new ErrorHandler(400, "Stock cannot be negative");
      }

      if (productData.price.lte(0)) {
        throw new ErrorHandler(400, "Price must be greater than 0");
      }

      const product = await ProductRepository.create(productData);
      return product;
    } catch (error) {
      throw error;
    };
  };

  static async getProducts(query: PaginationQuery) {
    try {
      const { page, limit, offset } = PaginateUtils.paginate(query);
      const products = await ProductRepository.findProducts(offset, limit);

      const productDiscounts = await Promise.all(
        products.map(product =>
          DiscountUtils.calculateDiscount(product)
        )
      );

      const totalItems = await ProductRepository.count();

      const meta = PaginateUtils.buildMeta({
        totalItems,
        currentPage: page,
        itemsPerPage: limit,
        itemCount: products.length,
      });

      return {
        productDiscounts,
        meta
      };
    } catch (error) {
      throw error;
    }
  }

  static async getProductById(productId: number) {
    try {
      const product = await ProductRepository.findProductById(productId);
      if (!product) {
        throw new ErrorHandler(404, "Product not found")
      };

      const productDiscount = DiscountUtils.calculateDiscount(product);
      return productDiscount;
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
        price: new Decimal(payload.price),
        stock: Number(payload.stock),
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