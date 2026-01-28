import { NextFunction, Request, Response } from "express";
import { WishlistCreateRequest } from "../types/wishlist";
import { WishlistService } from "../services/wishlist.service";
import { ErrorHandler } from "../utils/error.utils";
import { CustomerService } from "../services/customer.service";

export class WishlistController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        throw new ErrorHandler(401, "Unauthorized")
      };

      const customer = await CustomerService.getCustomerById(userId);
      if (!customer) {
        throw new ErrorHandler(404, "Customer not found!")
      }

      const payload = req.body as WishlistCreateRequest;
      const wishlist = await WishlistService.create(customer.id, payload);
      res.status(201).json({
        success: true,
        message: "Wishlist created successfully",
        data: wishlist
      });
    } catch (error) {
      next(error);
    };
  };

  static async getWishlists(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        throw new ErrorHandler(401, "Unauthorized")
      };

      const customer = await CustomerService.getCustomerById(userId);
      if (!customer) {
        throw new ErrorHandler(404, "Customer not found!")
      }

      const wishlists = await WishlistService.getWishlists(customer.id);
      res.status(200).json({
        success: true,
        message: "Fetched all wishlist successfully",
        data: wishlists
      });
    } catch (error) {
      next(error)
    };
  };

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = Number(req.user?.id);
      if (!customerId) {
        throw new ErrorHandler(401, "Unauthorized");
      }

      const wishlistId = Number(req.params.id);
      if (!wishlistId) {
        throw new ErrorHandler(400, "Wishlist ID is required");
      }

      const wishlist = await WishlistService.delete(customerId, wishlistId)
      res.status(200).json({
        success: true,
        message: "Removed product from wishlist successfully"
      });
    } catch (error) {
      next(error);
    };
  };
}