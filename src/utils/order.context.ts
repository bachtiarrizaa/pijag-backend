import prisma from "../config/prisma.config";
import { CreateOrder } from "../types/order/order";
import { Request } from "express";

export const orderContext = async (req: Request) => {
  const data: CreateOrder = req.body;
  let cashier_id: number | null = null;

  const role = req.user?.role_name;

  switch (role) {
    case "customer": {
      const customer = await prisma.customer.findUnique({
        where: { user_id: req.user?.id },
      });

      if (!customer) {
        const error: any = new Error("Customer not found");
        error.statusCode = 400;
        throw error;
      }

      data.customer_id = customer.id;
      break;
    }

    case "cashier": {
      cashier_id = req.user?.id;
      break;
    }
  }

  return { cashier_id, data };
};
