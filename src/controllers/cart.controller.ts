import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/error.utils";
import { CartService } from "../services/cart.service";
import { CustomerService } from "../services/customer.service";
import { CartCreateRequest, CartUpdateRequest } from "../types/cart";

export class CartController {
  static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        throw new ErrorHandler(401, "Unauthorized")
      };

      const customer = await CustomerService.getCustomerById(userId);
      if (!customer) {
        throw new ErrorHandler(404, "Customer not found")
      }

      const cart = await CartService.getCart(customer.id);
      res.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        data: cart
      });
    } catch (error) {
      next(error);
    };
  };

  static async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        throw new ErrorHandler(401, "Unauthorized")
      };

      const customer = await CustomerService.getCustomerById(userId);
      if (!customer) {
        throw new ErrorHandler(404, "Customer not found!")
      }

      const payload = req.body as CartCreateRequest;

      const addItem = await CartService.addItem(customer.id, payload);
      res.status(201).json({
        success: true,
        message: "Item added to cart successfully",
        data: addItem
      });
    } catch (error) {
      next(error);
    };
  };

  static async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const cartItemId = Number(req.params.id);
      if (!cartItemId) {
        throw new ErrorHandler(404, "CartItem not found");
      };

      const payload = req.body as CartUpdateRequest;

      const updatedItem = await CartService.updateItem(cartItemId, payload);
      if (!updatedItem) {
        return res.status(200).json({
          success: true,
          message: "Item removed from cart successfully",
          data: null
        })
      }
      res.status(200).json({
        success: true,
        message: "Item update successfully",
        data: updatedItem
      });
    } catch (error) {
      next(error);
    };
  };

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const cartItemId = Number(req.params.id);
      if (!cartItemId) {
        throw new ErrorHandler(404, "CartItem not found");
      };

      const deleteItem = await CartService.delete(cartItemId);
      res.status(200).json({
        success: true,
        message: "Item removed from cart successfully",
      });
    } catch (error) {
      next(error);
    };
  };
}