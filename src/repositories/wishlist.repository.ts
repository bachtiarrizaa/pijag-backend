import prisma from "../config/prisma.config";
import { WishlistCreateRequest } from "../types/wishlist";

export class WishlistRepository {
  static async findProductExist(customerId: number, productId: number) {
    try {
      const wishlist = await prisma.wishlist.findFirst({
        where: {
          customerId,
          productId
        }
      });
      return wishlist;
    } catch (error) {
      throw error;
    };
  };

  static async findWishlistById(wishlistId: number) {
    try {
      const wishlist = await prisma.wishlist.findFirst({
        where: { id: wishlistId }
      });
      return wishlist;
    } catch (error) {
      throw error;
    };
  };

  static async create(customerId: number, payload: WishlistCreateRequest) {
    try {
      const wishlist = await prisma.wishlist.create({
        data: {
          customerId,
          productId: payload.productId
        }
      });
      return wishlist;
    } catch (error) {
      throw error;
    };
  };

  static async delete(wishlistId: number) {
    try {
      const wishlist = await prisma.wishlist.delete({
        where: { id: wishlistId }
      });
      return wishlist;
    } catch (error) {
      throw error;
    };
  };
}