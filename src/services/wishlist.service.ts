import { WishlistRepository } from "../repositories/wishlist.repository";
import { WishlistCreateRequest } from "../types/wishlist";
import { ErrorHandler } from "../utils/error.utils";
import { ProductRepository } from "../repositories/product.repository";

export class WishlistService {
  static async create(customerId: number, payload: WishlistCreateRequest) {
    try {
      const wishlistData = {
        productId: payload.productId
      };

      if (!wishlistData.productId) {
        throw new ErrorHandler(400, "ProductId is required");
      };

      const product = await ProductRepository.findProductById(wishlistData.productId);
      if (!product) {
        throw new ErrorHandler(404, "Product not found");
      };

      const existingWishlist = await WishlistRepository.findProductExist(customerId, wishlistData.productId);
      if (existingWishlist) {
        throw new ErrorHandler(400, "Product already exist");
      };

      const wishlist = await WishlistRepository.create(customerId, wishlistData);
      return wishlist;
    } catch (error) {
      throw error
    };
  };

  static async delete(customerId: number, wishlistId: number) {
    try {
      const findWishlist = await WishlistRepository.findWishlistById(wishlistId);
      if (!findWishlist) {
        throw new ErrorHandler(404, "Wishlist not found");
      };

      const wishlist = await WishlistRepository.delete(wishlistId);
      return wishlist;
    } catch (error) {
      throw error;
    };
  };
}